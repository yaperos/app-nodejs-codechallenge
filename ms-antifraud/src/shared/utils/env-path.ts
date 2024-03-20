import { existsSync } from 'fs';
import { resolve } from 'path';

export function getEnvPath(dest: string): string {
  const env: string = process.env.NODE_ENV || 'development';
  const fallback: string = resolve('.env');
  const filename: string = env ? `.env.${env}` : '.env';
  let filePath: string = resolve(`${dest}/${filename}`);

  if (!existsSync(filePath)) {
    filePath = fallback;
  }

  return filePath;
}
