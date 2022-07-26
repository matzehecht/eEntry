import { Ticket } from '@eentry/types';
import Joi from 'joi';
import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { State } from '../../utils/auth';

type PathParams = DefaultContext & {
  params: {
    id: string;
  };
};

type RequestBody = {
  type: number;
};

const requestBodySchema = Joi.object<RequestBody>({
  type: Joi.number().integer().positive(),
});

export const patchById: Middleware<State, PathParams, Ticket> = async (ctx) => {
  const { value, error } = requestBodySchema.validate(ctx.request.body);

  if (error) {
    ctx.status = 400;
    return;
  }

  const tickets = await db('tickets').where('id', ctx.params.id).update(value, '*');

  if (!tickets[0]) {
    ctx.status = 404;
    return;
  }

  ctx.body = tickets[0];
};
