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
    valid: { from: valid_from, until: valid_until },
  } = value;

  const insertedTicketTypes = await db('ticket_types')
    // eslint-disable-next-line camelcase
    .insert({ name, valid_from, valid_until })
    .returning(['id', 'name', 'image', 'valid_from', 'valid_until']);

  const parsedTicketType = {
    id: insertedTicketTypes[0].id,
    image: insertedTicketTypes[0].image,
    name: insertedTicketTypes[0].name,
    valid: { from: insertedTicketTypes[0].valid_from, until: insertedTicketTypes[0].valid_until },
  };

  ctx.body = parsedTicketType;
};
