import { TicketType } from '@eentry/types';
import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { State } from '../../utils/auth';

type PathParams = DefaultContext & {
  params: {
    id: number;
  };
};

export const getById: Middleware<State, PathParams, TicketType> = async (ctx) => {
  const ticketType = await db('ticket_types').where('id', ctx.params.id).first();

  if (!ticketType) {
    ctx.status = 404;
    return;
  }

  ctx.body = {
    id: ticketType.id,
    image: ticketType.image,
    name: ticketType.name,
    valid: {
      from: ticketType.valid_from.toISOString(),
      until: ticketType.valid_until.toISOString(),
    },
  };
};
