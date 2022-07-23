import { Knex } from 'knex';
import { generateToken, hashAndSalt } from '../../utils/device';

const up = (knex: Knex) => {
  return knex.schema
    .createTable('devices', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.string('hash', 255).unique().notNullable().index();
      table.string('salt', 255).unique().notNullable().index();
      table.boolean('revoked').defaultTo(false).notNullable();
    })
    .createTable('roles', (table) => {
      table.increments('id').primary();
      table.string('name', 255).unique().notNullable();
    })
    .createTable('device_role', (table) => {
      table.increments('id').primary();
      table.integer('device_id').unsigned().notNullable();
      table.foreign('device_id').references('id').inTable('devices').onDelete('cascade');
      table.integer('role_id').unsigned().notNullable();
      table.foreign('role_id').references('id').inTable('roles').onDelete('cascade');
    })
    .createTable('events', (table) => {
      table.string('name', 255).primary();
      table.string('image', 255);
      table.specificType('date', 'DATE[]');
    })
    .createTable('ticket_types', (table) => {
      table.increments('id').primary();
      table.string('name', 255).notNullable();
      table.string('image', 255);
      table.dateTime('valid_from').notNullable();
      table.dateTime('valid_until').notNullable();
    })
    .createTable('tickets', (table) => {
      table.string('id', 255).primary();
      table.integer('type').unsigned().notNullable();
      table.foreign('type').references('id').inTable('ticket_types').onDelete('restrict');
      table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    })
    .createTable('ticket_events', (table) => {
      table.increments('id').primary();
      table.string('ticket_id', 255).notNullable();
      table.foreign('ticket_id').references('id').inTable('tickets').onDelete('cascade');
      table.timestamp('time').defaultTo(knex.fn.now()).notNullable();
      table.enu('event', ['CHECKOUT', 'CHECKIN', 'INVALIDATE'], { enumName: 'ticket_event_type', useNative: true }).notNullable();
    })
    .createView('ticket_states', (view) => {
      const caseState = knex.raw(
        `CASE WHEN e.event = 'INVALIDATE' THEN 'INVALID' WHEN e.event = 'CHECKOUT' THEN 'CHECKEDOUT' WHEN e.event = 'CHECKIN' THEN 'CHECKEDIN' ELSE 'VALID' END AS state`
      );
      const caseLastModified = knex.raw(`CASE WHEN e.time IS NOT NULL THEN e.time ELSE tickets.created_at END AS lastModified`);
      view.as(
        knex('tickets')
          .leftJoin(
            knex('ticket_events')
              .distinctOn('ticket_id')
              .select('time', 'event', 'ticket_id')
              .orderBy([
                { column: 'ticket_id', order: 'desc' },
                { column: 'time', order: 'desc' },
              ])
              .as('e'),
            'tickets.id',
            'e.ticket_id'
          )
          .select('tickets.id', 'tickets.type', caseState, caseLastModified)
      );
    })
    .then(async () => {
      const roleIds = await knex('roles').insert([{ name: 'admin' }, { name: 'entry' }, { name: 'boxoffice' }], ['id']);

      const token = generateToken();
      const { hash, salt } = hashAndSalt(token);
      const adminId = await knex('devices').insert(
        {
          hash,
          name: 'admin',
          salt,
        },
        ['id']
      );

      // eslint-disable-next-line camelcase
      const adminRolesMapping = roleIds.map(({ id: role_id }) => ({ device_id: adminId[0].id, role_id }));

      await knex('device_role').insert(adminRolesMapping);

      console.log(`Created new admin\nTOKEN: ${adminId[0].id}-${token}`);
    });
};

const down = (knex: Knex) => {
  return knex.schema
    .dropView('ticket_states')
    .dropTable('ticket_events')
    .dropTable('tickets')
    .dropTable('ticket_types')
    .dropTable('events')
    .dropTable('device_role')
    .dropTable('roles')
    .dropTable('devices')
    .raw('DROP TYPE IF EXISTS public.ticket_event_type;');
};

// eslint-disable-next-line import/no-unused-modules
export { down, up };
