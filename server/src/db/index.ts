import { resolve } from 'path';
import { DBDevice, DeviceRole, Role, DBEvent, DBTicket, Ticket, DBTicketEvent, DBTicketType } from '@eentry/types';
import { knex, Knex } from 'knex';
import { CONFIG } from '../config';

// eslint-disable-next-line import/no-unused-modules
export const DB_CONFIG = {
  client: 'pg',
  connection: CONFIG.PG_CONNECTION_STRING,
  migrations: {
    directory: resolve(__dirname, './migrations'),
  },
};

export const db = knex(DB_CONFIG);

export const initDb = async () => {
  await db.migrate.latest();
  // eslint-disable-next-line no-console
  console.log('Migrated db');
};

declare module 'knex/types/tables' {
  // See: https://knexjs.org/guide/#typescript
  interface Tables {
    device_role: Knex.CompositeTableType<DeviceRole, Pick<DeviceRole, 'device_id' | 'role_id'>, Pick<DeviceRole, 'device_id' | 'role_id'>>;
    devices: Knex.CompositeTableType<DBDevice, Pick<DBDevice, 'name' | 'hash' | 'salt'>, Pick<DBDevice, 'revoked'>>;
    events: DBEvent;
    roles: Knex.CompositeTableType<Role, Pick<Role, 'name'>, Pick<Role, 'name'>>;
    ticket_events: Knex.CompositeTableType<DBTicketEvent, Pick<DBTicketEvent, 'ticket_id' | 'event'>, {}, {}>;
    ticket_states: Knex.CompositeTableType<Ticket, {}, {}, {}>;
    ticket_types: Knex.CompositeTableType<
      DBTicketType,
      Pick<DBTicketType, 'name' | 'valid_from' | 'valid_until'>,
      Pick<Partial<DBTicketType>, 'image' | 'name' | 'valid_from' | 'valid_until'>
    >;
    tickets: Knex.CompositeTableType<DBTicket, Pick<DBTicket, 'id' | 'type'>, Pick<DBTicket, 'type'>, Pick<DBTicket, 'type'>>;
  }
}
