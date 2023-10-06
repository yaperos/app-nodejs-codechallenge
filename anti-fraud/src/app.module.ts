import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CachingModule } from './caching/caching.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration from './configuration/configuration';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      load: [configuration]
    }),
    CachingModule,
    ClientsModule.registerAsync([{
      imports:[ConfigModule],
      inject:[ConfigService],
      name: 'TRANSACTIONS-SERVICE',
      useFactory: (configService:ConfigService) => {
        return {
          transport:Transport.KAFKA,
          options: {
            client: {
              clientId: `transactions`,
              brokers: [`${configService.get("server.dns")}:${configService.get("kafka.port")}`]
            },
            consumer: {
              groupId: 'transactions-consumer',
            }
          }
        }
      }
    }])
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
