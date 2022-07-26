import cors from '@koa/cors';
import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import jwt from 'koa-jwt';
import { CONFIG } from './config';
import { router } from './controllers/router';
import { isTokenRevoked, removeFailedJWT } from './utils/auth';

const app = new Koa();

if (CONFIG.CORS) {
  app.use(cors({ credentials: true, origin: (ctx) => ctx.request.headers['origin'] || '*' }));
}
app.use(bodyParser());

if (!CONFIG.DISABLE_AUTH) {
  app.use(removeFailedJWT);
  // Do not use this middleware on paths `/auth/login` and `/auth/login/`
  app.use(
    jwt({
      audience: CONFIG.HOST,
      cookie: 'JWT',
      isRevoked: isTokenRevoked,
      issuer: CONFIG.HOST,
      secret: CONFIG.JWT_SECRET,
    }).unless({
      path: [/^\/api\/auth\/login\/?$/],
    })
  );
}

app.use(router.routes()).use(router.allowedMethods());

export { app as api };
