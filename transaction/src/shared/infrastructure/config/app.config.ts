import { ConfigService, registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  baseContextPath: process.env.BASE_CONTEXT_PATH,
  port: process.env.APP_PORT,
}));

const welcome = `Welcome to transaction`;

export const buildBanner = (configService: ConfigService) => {
  const port = configService.get<string>('app.port');
  const baseContentPath = configService.get<string>('app.baseContextPath');
  const base = `http://localhost:${port}`;
  const baseUrl = `${base}/${baseContentPath}`;
  return `
  ${welcome}
  Base url: ${baseUrl}
  Doc url: ${baseUrl}/doc
  GraphQL url: ${base}/graphql
  Context Path: ${baseContentPath}
  `;
};
