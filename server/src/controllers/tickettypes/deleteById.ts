import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { Device } from '../../types/Device';
import { State } from '../../utils/auth';

type PathParams = DefaultContext & {
  params: {
    id: number;
  };
};

export const deleteById: Middleware<State, PathParams, Device> = async (ctx) => {
  try {
    if ((await db('tickets').where('type_id', ctx.params.id)).length > 0) {
      ctx.status = 409;
      return;
    }

    await db('ticket_types').where('id', ctx.params.id).del();

    ctx.status = 204;
  } catch (e) {
    console.error(e);
  }
};
