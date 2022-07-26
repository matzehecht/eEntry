import Router from '@koa/router';
import { check } from './auth/auth';
import { login } from './auth/login';
import { devices } from './devices/router';
import { event } from './event/router';
import { roles } from './roles/router';
import { tickets } from './tickets/router';
import { tickettypes } from './tickettypes/router';

const router = new Router();

router.get('/auth/login', login);
router.get('/auth', check);
router.use('/devices', devices.routes(), devices.allowedMethods());
router.use('/roles', roles.routes(), roles.allowedMethods());
router.use('/event', event.routes(), event.allowedMethods());
router.use('/tickets', tickets.routes(), tickets.allowedMethods());
router.use('/tickettypes', tickettypes.routes(), tickettypes.allowedMethods());

router.all('', (ctx) => {
  ctx.status = 404;
});

export { router };
