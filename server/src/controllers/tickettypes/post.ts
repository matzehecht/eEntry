import { baseTicketTypeSchema, TicketType } from '@eentry/types';
import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { State } from '../../utils/auth';

export const post: Middleware<State, DefaultContext, TicketType> = async (ctx) => {
  const { value, error } = baseTicketTypeSchema.validate(ctx.request.body);

  if (error) {
    ctx.status = 400;
    return;
  }

  const {
    name,
    valid: { from, until },
  } = value;

  const valid_from = typeof from === 'string' ? new Date(Date.parse(from)) : from;
  const valid_until = typeof until === 'string' ? new Date(Date.parse(until)) : until;

  const insertedTicketTypes = await db('ticket_types')
    // eslint-disable-next-line camelcase
    .insert({ name, valid_from, valid_until })
    .returning(['id', 'name', 'image', 'valid_from', 'valid_until']);

  const parsedTicketType = {
    id: insertedTicketTypes[0].id,
    image: insertedTicketTypes[0].image,
    name: insertedTicketTypes[0].name,
    valid: { from: insertedTicketTypes[0].valid_from.toISOString(), until: insertedTicketTypes[0].valid_until.toISOString() },
  };

  ctx.body = parsedTicketType;
};
