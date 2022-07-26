import Joi from 'joi';

export interface BaseDevice {
  name: string;
  roles: string[];
}

export const baseDeviceSchema = Joi.object<BaseDevice>({
  name: Joi.string().min(1).required(),
  roles: Joi.array().items(Joi.string().min(1)).required(),
}).options({ presence: 'required' });

export interface Device extends BaseDevice {
  id: number;
  revoked: boolean;
}

export interface OneTimeDevice extends Device {
  token: string;
}

export interface DBDevice extends Omit<Device, 'roles'> {
  hash: string;
  salt: string;
}

export interface Role {
  id: number;
  name: string;
}

export interface DeviceRole {
  device_id: Device['id'];
  id: number;
  role_id: Role['id'];
}
