import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TransactionEntity } from './entities/transaction.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ClientsModule.register([
      {
        name: 'FRAUD_DETECTION_MICROSERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'fraud-detection',
            brokers: [`localhost:9092`],
          },
          consumer: {
            groupId: 'fraud-detection-consumer',
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([TransactionEntity]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
