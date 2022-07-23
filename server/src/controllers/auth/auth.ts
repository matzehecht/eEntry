import { Middleware } from 'koa';
import { db } from '../../db';
import { State } from '../../utils/auth';
import { hasRole } from './utils';

export const check: Middleware<State> = async (ctx) => {
  const device = await db('devices').where('id', ctx.state.user.sub).first();

  if (!device || device.revoked) {
    ctx.status = 401;
    return;
  }

  const queryRole = ctx.query['role'];

  if (queryRole && !(await hasRole(queryRole, device))) {
    ctx.status = 403;
    return;
  }
  ctx.status = 204;
  return undefined;
};
