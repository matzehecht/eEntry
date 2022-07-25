import { HttpError } from 'http-errors';
import { JwtPayload } from 'jsonwebtoken';
import { DefaultState, Middleware } from 'koa';
import { Options } from 'koa-jwt';
import { db } from '../db';

export const isTokenRevoked: Options['isRevoked'] = async (_, decodedToken) => {
  // TODO code device token in JWT and check here
  // eslint-disable-next-line no-type-assertion/no-type-assertion
  const payload = decodedToken as JwtPayload;

  if (!payload.sub) {
    return false;
  }
  const device = await db('devices').where('id', payload.sub).first();
  return !device || device.revoked;
};

export type State = DefaultState & {
  user: JwtPayload & {
    roles?: string;
  };
};

export const removeFailedJWT: Middleware = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    // eslint-disable-next-line no-type-assertion/no-type-assertion
    if (401 === (err as HttpError).status) {
      ctx.cookies.set('JWT', undefined, { overwrite: true, sameSite: 'strict' });
      ctx.status = 401;
      return;
    }
  }
};

export const checkOneOfRoles =
  (roles: string[]): Middleware<State> =>
  async (ctx, next) => {
    const requestRoles = ctx.state.user.roles?.split(' ');

    if (!requestRoles?.some((requestRole) => roles.includes(requestRole))) {
      ctx.status = 403;
      return;
    }
    return await next();
  };
