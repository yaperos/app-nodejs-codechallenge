import { registerAs } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import * as PACKAGE_JSON from '../../package.json';

export default registerAs('config', () => {
   return { 
      project: {
        name: PACKAGE_JSON.name,
      },
      server: {                
        isProd: process.env.NODE_ENV === 'production',
        port: parseInt(process.env.PORT, 10) || 8080,
        origins: process.env.ORIGINS ? process.env.ORIGINS.split(',') : '*',
        allowedHeaders: process.env.ALLOWED_HEADERS,
        allowedMethods: process.env.ALLOWED_METHODS,
        corsEnabled: process.env.CORS_ENABLED.toLowerCase() === 'true',
        corsCredentials: process.env.CORS_CREDENTIALS.toLowerCase() === 'true',
      },
      database: {
          type: 'postgres',
          host: process.env.TYPEORM_HOST,
          port: parseInt(process.env.TYPEORM_PORT, 10),
          username: process.env.TYPEORM_USERNAME,
          password: process.env.TYPEORM_PASSWORD,
          database: process.env.TYPEORM_DATABASE,
          logging: false,
          synchronize: false,
          autoLoadEntities: true,
          entities: [__dirname + '/*/.model{.ts,.js}'],
          extra: {
            trustServerCertificate: true,
          },
      },
      graphql: {
        playground: process.env.GRAPHQL_PLAYGROUND === 'true',
        autoSchemaFile: join(process.cwd(), process.env.GRAPHQP_SCHEMA_DIR),          
      },
      kafka: {
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_CLIENT_ID,
            brokers: process.env.KAFKA_BROKER.split('|'),
            logLevel: parseInt(process.env.KAFKA_LOG_LEVEL,10), 
          },
          consumer: {
            groupId: process.env.KAFKA_CLIENT_ID,
          }
        }
      }
    }
})