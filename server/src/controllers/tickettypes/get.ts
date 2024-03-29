import { TicketType } from '@eentry/types';
import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { State } from '../../utils/auth';

export const get: Middleware<State, DefaultContext, TicketType[]> = async (ctx) => {
  const ticketTypes = await db('ticket_types');
  const parsed = ticketTypes.map(({ id, image, name, valid_from, valid_until }) => ({
    id,
    image,
    name,
    valid: {
      from: valid_from.toISOString(),
      until: valid_until.toISOString(),
    },
  }));
  ctx.body = parsed;
};
