import { ConfigService, registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  env: process.env.BASE_ENVIRONMENT,
  baseContextPath: process.env.BASE_CONTEXT_PATH,
  port: process.env.APP_PORT,
  host: process.env.APP_HOST
}));

const banner = `
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
██░░░░██░░░████░░░██████░░██████░░░░░░░
░██░░██░░██░░░░██░██░░░██░██░░░░░░░░░░░
░░░██░░░░██░░░░██░██████░░██████░░░░░░░
░░░██░░░░████████░██░░░░░░██░░░░░░░░░░░
░░░██░░░░██░░░░██░██░░░░░░██████░░░░░░░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
    Welcome to Yape
`;

export const buildBanner = (configService: ConfigService) => {
  return `

  ${banner}
  Host: ${configService.get<string>('app.host')}
  Port: ${configService.get<string>('app.port')}
  Context Path: ${configService.get<string>('app.baseContextPath')}
  Environment: ${configService.get<number>('app.env')}
  GraphQL Playground: ${configService.get<string>('app.host')}:${configService.get<string>('app.port')}/graphql
  Swagger: ${configService.get<string>('app.host')}:${configService.get<string>('app.port')}/api/yape-transactions-ms/doc
  `;
};
