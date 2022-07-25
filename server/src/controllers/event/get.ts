import { Event } from '@eentry/types';
import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { State } from '../../utils/auth';

export const get: Middleware<State, DefaultContext, Event> = async (ctx) => {
  const event = await db('events').first();

  ctx.body = event ?? {
    date: null,
    image: null,
    name: null,
  };
};
