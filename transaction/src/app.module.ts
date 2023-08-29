import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';
import { UserAccount } from './entities/userAccount';
import { User } from './entities/user';
import { TransferType } from './entities/transferType';
import { TransferTypeRepository } from './repositories/transferType.repository';
import { UserAccountRepository } from './repositories/userAccount.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { Transaction } from './entities/transaction';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TransactionEvent } from './events/transaction.event';
import testEnv from './config/typeorm.test.config';
import devEnv from './config/typeorm.dev.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ClientsModule.register([
      {
        name: 'ANTI-FRAUD_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'anti-fraud-consumer',
          },
        },
      },
    ]),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const environment =
          configService.get('NODE_ENV') === 'test' ? testEnv : devEnv;
        return { ...environment.options, autoLoadEntities: true };
      },
    }),
    // TypeOrmModule.forRoot({ ...devEnv.options, autoLoadEntities: true }),
    TypeOrmModule.forFeature([User, UserAccount, TransferType, Transaction]),
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransferTypeRepository,
    UserAccountRepository,
    TransactionRepository,
    TransactionEvent,
  ],
})
export class AppModule {}
