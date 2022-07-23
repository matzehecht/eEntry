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

export const getById: Middleware<State, PathParams, Device> = async (ctx) => {
  const revokedFilter = ctx.query['revoked'];

  if (Array.isArray(revokedFilter)) {
    ctx.status = 400;
    return;
  }

  const device = await db('devices').where('id', ctx.params.id).select('id', 'name', 'revoked').first();

  if (!device) {
    ctx.status = 404;
    return;
  }

  const roles = await getRoles(device.id);

  ctx.body = { ...device, roles };
};
