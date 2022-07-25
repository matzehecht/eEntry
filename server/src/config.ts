import { readFileSync } from 'fs';
import { hostname } from 'os';
import { config } from 'dotenv';

config({ path: '../.env' });

type TConfig = {
  CORS: boolean;
  DISABLE_AUTH: boolean;
  HTTPS_PORT: number;
  HTTP_PORT: number;
  JWT_SECRET: string;
  PG_CONNECTION_STRING: string;
  SSL_CERTIFICATE: string | Buffer;
  SSL_PRIVATE_KEY: string | Buffer;
  SSL_PRIVATE_KEY_PASSPHRASE?: string;
  UPLOAD_DIR: string;
};

const DEFAULTS: TConfig = {
  CORS: false,
  DISABLE_AUTH: false,
  HTTP_PORT: 80,
  HTTPS_PORT: 443,
  JWT_SECRET: 'secret',
  PG_CONNECTION_STRING: 'postgresql://localhost:5432/eentry',
  SSL_CERTIFICATE: '../.certs/server.crt',
  SSL_PRIVATE_KEY: '../.certs/server.key',
  UPLOAD_DIR: '../uploads',
};

const SSL_CERTIFICATE =
  process.env.SSL_CERTIFICATE && process.env.SSL_CERTIFICATE?.startsWith('---')
    ? process.env.SSL_CERTIFICATE
    : readFileSync(process.env.SSL_CERTIFICATE ?? DEFAULTS.SSL_CERTIFICATE);

const SSL_PRIVATE_KEY =
  process.env.SSL_PRIVATE_KEY && process.env.SSL_PRIVATE_KEY?.startsWith('---')
    ? process.env.SSL_PRIVATE_KEY
    : readFileSync(process.env.SSL_PRIVATE_KEY ?? DEFAULTS.SSL_PRIVATE_KEY);

type AdditionalConfig = {
  HOST: string;
};

export const CONFIG: TConfig & AdditionalConfig = {
  ...DEFAULTS,
  ...process.env,
  HOST: hostname(),
  SSL_CERTIFICATE,
  SSL_PRIVATE_KEY,
};
