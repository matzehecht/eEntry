import { Device } from '@eentry/types';
import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { State } from '../../utils/auth';
import { deviceRoleMapQuery } from '../../utils/device';

export const get: Middleware<State, DefaultContext, Device[]> = async (ctx) => {
  const revokedFilter = ctx.query['revoked'];

  if (Array.isArray(revokedFilter)) {
    ctx.status = 400;
    return;
  }

  const query = db('devices');

  if (typeof revokedFilter !== 'undefined') {
    query.where('revoked', '=', revokedFilter);
  }

  const devices = await query.leftJoin(deviceRoleMapQuery, 'deviceRoleMapping.device_id', 'id').select('id', 'name', 'roles', 'revoked');
  ctx.body = devices;
};
