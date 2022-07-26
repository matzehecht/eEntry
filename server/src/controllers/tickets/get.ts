import { Ticket } from '@eentry/types';
import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { State } from '../../utils/auth';

export const get: Middleware<State, DefaultContext, Ticket[]> = async (ctx) => {
  const ticketStates = await db('ticket_states');
  ctx.body = ticketStates;
};
