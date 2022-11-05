import { join } from 'path';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// ORM
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './entities/transaction.entity';
import { TranferTypeModule } from './tranfer-type/tranfer-type.module';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ANTI_FRAUD',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'anti-fraud',
            brokers: [process.env.KAFKA_URL],
          },
          consumer: {
            groupId: 'anti-fraud-consumer',
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
    TypeOrmModule.forFeature([Transaction]),
    TranferTypeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
