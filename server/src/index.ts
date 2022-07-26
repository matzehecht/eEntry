/* eslint-disable import/no-unused-modules */
import http from 'http';
import https from 'https';
import { resolve } from 'path';
import Koa from 'koa';
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
import logger from 'koa-logger';
import mount from 'koa-mount';
import enforceHttps from 'koa-sslify';
import serve from 'koa-static';
import { api } from './api';
import { CONFIG } from './config';

import { initDb } from './db';

const app = new Koa();

app.use(logger());

app.use(enforceHttps({ port: CONFIG.HTTPS_PORT }));
app.use(conditional());
app.use(etag());

app.use(mount('/api', api));
app.use(mount('/uploads', serve(CONFIG.UPLOAD_DIR)));
app.use(serve(resolve('../web/dist')));
// Catch everything falling through
app.use(async (ctx, next) => {
  return await serve(resolve('../web/dist'))(Object.assign(ctx, { path: 'index.html' }), next);
});

initDb().then(() => {
  http.createServer(app.callback()).listen(CONFIG.HTTP_PORT);
  https
    .createServer(
      { cert: CONFIG.SSL_CERTIFICATE, key: CONFIG.SSL_PRIVATE_KEY, passphrase: CONFIG.SSL_PRIVATE_KEY_PASSPHRASE },
      app.callback()
    )
    .once('listening', () => {
      // eslint-disable-next-line no-console
      console.log(`Server listening to https://localhost:${CONFIG.HTTPS_PORT}`);
    })
    .listen(CONFIG.HTTPS_PORT);
});
