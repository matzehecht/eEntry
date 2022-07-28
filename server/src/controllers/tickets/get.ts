import { Ticket } from '@eentry/types';
import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { State } from '../../utils/auth';

type QueryParams = DefaultContext & {
  query: {
    state?: string;
    type?: number;
  };
};

export const get: Middleware<State, QueryParams, Ticket[]> = async (ctx) => {
  const filterState = ctx.query['state'];
  const filterType = ctx.query['type'];

  const ticketQuery = db('ticket_states');

  if (typeof filterState === 'string') {
    ticketQuery.where('state', filterState);
  }
  if (typeof filterType === 'number') {
    ticketQuery.where('type', filterType);
  }

  const ticketStates = await ticketQuery;
  ctx.body = ticketStates;
};
