import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { TicketType } from '../../types/TicketType';
import { State } from '../../utils/auth';
import { upload } from '../../utils/images';

type PathParams = DefaultContext & {
  params: {
    id: number;
  };
};

export const postImage: Middleware<State, PathParams, TicketType> = async (ctx) => {
  const prevTicketType = await db('ticket_types').where('id', ctx.params.id).first();
  if (!prevTicketType) {
    ctx.status = 404;
    return;
  }

  const fileName = await upload(ctx);

  if (!fileName) {
    ctx.status = 400;
    return;
  }

  const updatedTicketType = await db('ticket_types')
    .where('id', ctx.params.id)
    .update({ image: fileName }, ['id', 'name', 'image', 'valid_from', 'valid_until']);

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
