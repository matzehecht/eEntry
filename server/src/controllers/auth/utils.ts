import { db } from '../../db';
import { DBDevice } from '../../types/Device';

export const hasRole = async (role: string | string[], device: DBDevice) => {
  const roles = Array.isArray(role) ? role : [role];
  const deviceRoles = await db('device_role')
    .leftJoin('roles', 'device_role.role_id', 'roles.id')
    .where('device_id', device.id)
    .whereIn('name', roles);
  return deviceRoles.length > 0;
};
