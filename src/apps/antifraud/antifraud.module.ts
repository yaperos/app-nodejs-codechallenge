import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import EventBusModule from 'src/contexts/antifraud/shared/infraestructure/event-bus.module.ts/event-bus.module';
import { ValidateTransactionController } from './controllers/validate-transaction.controller';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: '.env.antifraud',
        }),
        EventBusModule,
    ],
    controllers: [ValidateTransactionController],
    providers: [],
})
export class AntifraudModule {}
