import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ValidationService } from './validation.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ValidationController } from './validation.controller';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
              name: 'MS_TRANSACTION_SERVICE',
              imports: [ConfigModule],
              inject: [ConfigService],
              useFactory: async (configService: ConfigService) => ({
                transport: Transport.KAFKA,
                options: {
                  client: {
                    clientId: 'ms-transaction',
                    brokers: ['localhost:9092'],
                  },
                  consumer: {
                    groupId: 'ms-transaction-consumer',
                  },
                },
              }),
            },
          ]),
    ],
    
    controllers: [ValidationController],
    providers: [
        ValidationService
    ]
})
export class ValidationModule {}
