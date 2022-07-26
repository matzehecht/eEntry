import { createHash } from 'crypto';
import randomString from 'randomstring';
import { db } from '../db';

export const generateToken = () => randomString.generate({ charset: 'numeric', length: 20 });

const generateSalt = () => randomString.generate({ charset: 'alphanumeric', length: 10 });

export const hashAndSalt = (token: string, salt?: string) => {
  const usedSalt = salt ?? generateSalt();

  return {
    hash: createHash('sha256').update(`${usedSalt}${token}`).digest('base64'),
    salt: usedSalt,
  };
};

export const getRoles = async (deviceId: number) =>
  (await db('device_role').leftJoin('roles', 'device_role.role_id', 'roles.id').where('device_id', deviceId)).map(
    ({ name: roleName }) => roleName
  );

export const deviceRoleMapQuery = db('device_role')
  .leftJoin('roles', 'device_role.role_id', 'roles.id')
  .select(['device_id', db.raw('array_agg(name) as roles')])
  .groupBy('device_id')
  .as('deviceRoleMapping');
