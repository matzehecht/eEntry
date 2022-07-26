import { Event } from '@eentry/types';
import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { State } from '../../utils/auth';
import { upload } from '../../utils/images';

export const postImage: Middleware<State, DefaultContext, Event> = async (ctx) => {
  const fileName = await upload(ctx);

  if (!fileName) {
    ctx.status = 400;
    return;
  }

  if ((await db('events')).length === 0) {
    const newEvents = await db('events').insert({ image: fileName }).returning(['name', 'image', 'date']);
    ctx.body = newEvents[0];
    return;
  }

  const updatedEvents = await db('events').update({ image: fileName }).returning(['name', 'image', 'date']);

  ctx.body = updatedEvents[0];
};
