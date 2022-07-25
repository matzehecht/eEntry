import { TicketType } from '@eentry/types';
import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { State } from '../../utils/auth';
import { remove } from '../../utils/images';

export const deleteImage: Middleware<State, DefaultContext, TicketType> = async (ctx) => {
  const prevTicketType = await db('ticket_types').where('id', ctx.params.id).first();
  if (!prevTicketType) {
    ctx.status = 404;
    return;
  }

  if (prevTicketType.image) {
    await remove(prevTicketType.image);
  }

  const updatedTicketType = await db('ticket_types')
    .update({ image: null })
    .returning(['id', 'name', 'image', 'valid_from', 'valid_until']);

  if (!updatedTicketType[0]) {
    ctx.status = 404;
    return;
  }

  ctx.body = {
    id: updatedTicketType[0].id,
    image: updatedTicketType[0].image,
    name: updatedTicketType[0].name,
    valid: {
      from: updatedTicketType[0].valid_from,
      until: updatedTicketType[0].valid_until,
    },
  };
};
