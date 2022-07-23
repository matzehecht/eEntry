import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { baseDeviceSchema, Device, OneTimeDevice } from '../../types/Device';
import { State } from '../../utils/auth';
import { deviceRoleMapQuery, generateToken, hashAndSalt } from '../../utils/device';

export const post: Middleware<State, DefaultContext, OneTimeDevice> = async (ctx) => {
  const { value, error } = baseDeviceSchema.validate(ctx.request.body);

  if (error) {
    ctx.status = 400;
    return;
  }

  const { name, roles } = value;

  if ((await db('roles').whereIn('name', roles)).length !== roles.length) {
    ctx.status = 404;
    return;
  }

  const token = generateToken();
  const { hash, salt } = hashAndSalt(token);

  await db.transaction(async (trx) => {
    const device = await db('devices').insert({ hash, name, salt }, ['id', 'name', 'revoked']).transacting(trx);
    const newDeviceId = device[0].id;

    const dbRoles = await db('roles').whereIn('name', roles).select('id').transacting(trx);
    await db('device_role')
      // eslint-disable-next-line camelcase
      .insert(dbRoles.map(({ id: role_id }) => ({ device_id: newDeviceId, role_id })))
      .transacting(trx);
    const enrichedDevice: Device = await db('devices')
      .where('id', newDeviceId)
      .leftJoin(deviceRoleMapQuery, 'deviceRoleMapping.device_id', 'id')
      .select('id', 'name', 'roles', 'revoked')
      .first()
      .transacting(trx);
    ctx.body = { ...enrichedDevice, token: `${enrichedDevice.id}-${token}` };
  });
};
