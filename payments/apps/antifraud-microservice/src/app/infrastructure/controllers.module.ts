import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MicroserviceClient } from '@payments/shared/constant';
import { AntifraudController } from './antifraud/antifraud.controller';
import { AntifraudService } from './antifraud/antifraud.service';

@Module({
    imports: [ClientsModule.register([
        {
            name: MicroserviceClient.Transaction,
            transport: Transport.TCP,
            options: {
                host: '127.0.0.1',
                port: 5555
            }
        }
    ])],
    controllers: [AntifraudController],
    providers: [AntifraudService],
})
export class ControllersModule { }