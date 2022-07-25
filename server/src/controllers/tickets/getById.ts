import { Ticket } from '@eentry/types';
import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { State } from '../../utils/auth';

type PathParams = DefaultContext & {
  params: {
    id: string;
  };
};

export const getById: Middleware<State, PathParams, Ticket> = async (ctx) => {
  const ticketState = await db('ticket_states').where('id', ctx.params.id).first();

  if (ticketState) {
    ctx.body = ticketState;
  }
};
