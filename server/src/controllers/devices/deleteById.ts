import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { Device } from '../../types/Device';
import { State } from '../../utils/auth';
import { getRoles } from '../../utils/device';

type PathParams = DefaultContext & {
  params: {
    id: number;
  };
};

export const deleteById: Middleware<State, PathParams, Device> = async (ctx) => {
  const [device] = await db('devices').where('id', ctx.params.id).update({ revoked: true }, ['id', 'name', 'revoked']);

  if (!device) {
    ctx.status = 404;
    return;
  }

  const roles = await getRoles(device.id);

  ctx.body = { ...device, roles };
};
