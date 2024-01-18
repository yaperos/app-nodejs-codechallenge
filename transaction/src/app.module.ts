import { Module } from '@nestjs/common';
import { TransactionController } from './app.controller';
import { AppService } from './app.service';
import { CqrsModule } from '@nestjs/cqrs';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    CqrsModule,
    ClientsModule.register([
      {
        name: 'GENERATE_TRANSACTION',
        transport: Transport.KAFKA,
        options: {
          client:{
            brokers: ['localhost:9092']
          }
        }
      }
    ])
  ],
  controllers: [TransactionController],
  providers: [AppService],
})
export class AppModule {}
