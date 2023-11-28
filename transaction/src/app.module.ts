import { join } from 'path';

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './entities/transaction.entity';
// import { TranferTypeModule } from './tranfer-type/tranfer-type.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTI_FRAUD',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud-client',
            brokers: [process.env.KAFKA_URL],
          },
          consumer: {
            groupId: 'hero-consumer',
          },
        },
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT, 10),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: 'postgres',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([TransactionEntity]),
    // TranferTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
