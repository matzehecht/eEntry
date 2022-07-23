import { createWriteStream, existsSync } from 'fs';
import { mkdir, rm } from 'fs/promises';
import { Context } from 'koa';
import { getExtension } from 'mime';
import randomString from 'randomstring';
import { CONFIG } from '../config';

export const upload = async (ctx: Context) => {
  const contentType = ctx.request.is('image/*');

  if (!contentType) {
    ctx.status = 400;
    return;
  }

  const fileExt = getExtension(contentType);

  const fileName = `${randomString.generate({ charset: 'alphanumeric', length: 32 })}.${fileExt}`;

  if (!existsSync(CONFIG.UPLOAD_DIR)) {
    await mkdir(CONFIG.UPLOAD_DIR, { recursive: true });
  }

  const stream = createWriteStream(`${CONFIG.UPLOAD_DIR}/${fileName}`);

  ctx.req.pipe(stream);
  return `uploads/${fileName}`;
};

export const remove = async (file: string) => {
  const fileName = file.replace('uploads/', '');
  return rm(`${CONFIG.UPLOAD_DIR}/${fileName}`);
};
