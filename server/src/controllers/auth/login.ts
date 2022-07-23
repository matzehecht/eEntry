import { addHours } from 'date-fns';
import Joi from 'joi';
import { sign, SignOptions } from 'jsonwebtoken';
import { Middleware } from 'koa';
import { CONFIG } from '../../config';
import { db } from '../../db';
import { getRoles, hashAndSalt } from '../../utils/device';
import { hasRole } from './utils';

const headerSchema = Joi.object<{ token: string }>({
  token: Joi.string()
    .min(1)
    .pattern(/[0-9]+-[a-z0-9]/i, 'token')
    .required(),
})
  .unknown()
  .options({ presence: 'required' });

export const login: Middleware = async (ctx) => {
  const { value, error } = headerSchema.validate(ctx.header);

  if (error) {
    ctx.status = 400;
    return;
  }

  const [inputId, inputToken] = value.token.split('-');

  const device = await db('devices').where('id', Number(inputId)).first();

  if (!device || device.revoked) {
    ctx.status = 401;
    return;
  }

  const { id, name, salt, hash } = device;

  const queryRole = ctx.query['role'];

  if (queryRole && !(await hasRole(queryRole, device))) {
    ctx.status = 403;
    return;
  }

  if (hash !== hashAndSalt(inputToken, salt).hash) {
    ctx.status = 401;
    return;
  }

  const roles = await getRoles(id);
  const payload = { name, roles: roles.join(' ') };
  const options: SignOptions = {
    audience: CONFIG.HOST,
    expiresIn: '1h',
    issuer: CONFIG.HOST,
    subject: String(id),
  };
  const jwt = sign(payload, CONFIG.JWT_SECRET, options);
  ctx.cookies.set('JWT', jwt, { expires: addHours(Date.now(), 1) });
  ctx.status = 204;
  return undefined;
};
