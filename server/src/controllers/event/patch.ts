import { baseEventSchema, Event } from '@eentry/types';
import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { State } from '../../utils/auth';

export const patch: Middleware<State, DefaultContext, Event> = async (ctx) => {
  const { value, error } = baseEventSchema.validate(ctx.request.body);

  if (error) {
    ctx.status = 400;
    return;
  }

  if ((await db('events')).length === 0) {
    const newEvents = await db('events').insert(value).returning(['name', 'image', 'date']);
    ctx.body = newEvents[0];
    return;
  }

  const updatedEvents = await db('events').update(value).returning(['name', 'image', 'date']);

  ctx.body = updatedEvents[0];
};
