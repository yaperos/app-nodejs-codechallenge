import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from 'apps/shared/database/database.module';
import { Transaction } from 'apps/shared/database/entities/transaction.entity';
import { KafkaEnum } from 'apps/shared/enum/kafka-config.enum';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ClientsModule.register([
      {
        name: KafkaEnum.Name,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: KafkaEnum.ClientID,
            brokers: [KafkaEnum.Broker1],
          },
          consumer: {
            groupId: KafkaEnum.GroupId
          }
        }
      },
    ]),
    TypeOrmModule.forFeature([Transaction]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
