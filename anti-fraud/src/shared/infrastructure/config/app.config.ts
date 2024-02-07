import { ConfigService, registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  baseContextPath: process.env.BASE_CONTEXT_PATH,
  port: process.env.APP_PORT,
}));

const welcome = `Welcome to anti fraud`;

export const buildBanner = (configService: ConfigService) => {
  const port = configService.get<string>('app.port');
  const baseContentPath = configService.get<string>('app.baseContextPath');
  const baseUrl = `http://localhost:${port}/${baseContentPath}`;
  return `
  ${welcome}
  Base url: ${baseUrl}
  Doc url: ${baseUrl}/doc
  Context Path: ${baseContentPath}
  `;
};
