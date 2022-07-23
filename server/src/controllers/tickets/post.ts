import Joi, { ValidationResult } from 'joi';
import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { BaseTicket, baseTicketSchema } from '../../types/Ticket';
import { State } from '../../utils/auth';

export const post: Middleware<State, DefaultContext> = async (ctx) => {
  // eslint-disable-next-line no-type-assertion/no-type-assertion
  const { value, error } = Joi.array().items(baseTicketSchema).validate(ctx.request.body) as ValidationResult<BaseTicket[]>;

  if (error) {
    ctx.status = 400;
    return;
  }

  await db('tickets').insert(value);

  ctx.status = 204;
};
