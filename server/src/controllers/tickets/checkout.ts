import { Ticket } from '@eentry/types';
import Joi, { ValidationResult } from 'joi';
import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { State } from '../../utils/auth';

type PathParams = DefaultContext & {
  params: {
    id: string;
  };
};

export const checkout: Middleware<State, PathParams, Ticket> = async (ctx) => {
  const ticket = await db('ticket_states').where('id', ctx.params.id).first();

  if (!ticket) {
    ctx.status = 404;
    return;
  }

  if (ticket.state !== 'CHECKEDIN') {
    ctx.status = 409;
    return;
  }

  // eslint-disable-next-line no-type-assertion/no-type-assertion
  const { value } = Joi.boolean().validate(ctx.query['dryrun']) as ValidationResult<boolean>;

  if (!value) {
    await db('ticket_events').insert({ event: 'CHECKOUT', ticket_id: ctx.params.id });
  }

  const ticketState = await db('ticket_states').where('id', ctx.params.id).first();

  if (ticketState) {
    ctx.body = ticketState;
  }
};
