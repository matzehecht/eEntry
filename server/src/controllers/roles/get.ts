import { DefaultContext, Middleware } from 'koa';
import { db } from '../../db';
import { State } from '../../utils/auth';

export const get: Middleware<State, DefaultContext, string[]> = async (ctx) => {
  const roles = await db('roles').select('name');
  ctx.body = roles.map(({ name }) => name);
};
