import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TransactionController } from './api/transaction.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './shared/type-orm-config.service';
import { TransactionAdapter } from './infrastructure/adapters/transaction.adapter';
import { TransactionService } from './application/services/transaction.service';
import { configValidationSchema } from './shared/config.validation-schema';
import { TransactionEntity } from './infrastructure/entities/transaction.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';


@Module({
  imports: [ConfigModule.forRoot({
            envFilePath: [`.env.development`],
            validationSchema: configValidationSchema
          }),
            TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService,
              imports: [ConfigModule],
            }),
            TypeOrmModule.forFeature([TransactionEntity]),
            ClientsModule.register([
              {
                name: 'TRANSACTION_EVENTS',
                transport: Transport.KAFKA,
                options: {
                  client: {
                    brokers: ['localhost:9092'],
                  },
                  consumer: {
                    groupId: 'transaction-consumer',
                  },
                },
              },
            ]),
          ],
  controllers: [TransactionController],
  providers: [AppService,  
            TransactionAdapter,
            TransactionService],
            
})
export class AppModule {}
