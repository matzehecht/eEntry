import { Event } from '@eentry/types';
import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { State } from '../../utils/auth';
import { remove } from '../../utils/images';

export const deleteImage: Middleware<State, DefaultContext, Event> = async (ctx) => {
  const event = await db('events').first();

  if (!event) {
    ctx.body = {
      date: null,
      image: null,
      name: null,
    };
    return;
  }

  if (event.image) {
    await remove(event.image);
  }

  const updatedEvents = await db('events').update({ image: null }).returning(['name', 'image', 'date']);

  ctx.body = updatedEvents[0];
};
