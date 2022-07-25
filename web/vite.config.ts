import { readFileSync } from 'fs';
/* eslint-disable import/no-unused-modules */
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '..', '');

  const key = env.SSL_PRIVATE_KEY ? readFileSync(env.SSL_PRIVATE_KEY) : undefined;
  const cert = env.SSL_CERTIFICATE ? readFileSync(env.SSL_CERTIFICATE) : undefined;

  return {
    envDir: '..',
    plugins: [svgr(), react()],
    server: {
      https: {
        cert,
        key,
        passphrase: env.SSL_PRIVATE_KEY_PASSPHRASE,
      },
    },
  };
});
