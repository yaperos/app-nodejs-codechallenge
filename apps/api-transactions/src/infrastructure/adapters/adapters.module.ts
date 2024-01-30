import { Module, forwardRef } from '@nestjs/common';
import { AdaptersService } from './adapters.service';
import { KafkaAdapterModule } from '../../infrastructure/adapters/clients/kafka/kafka-adapter.module';
import { ConfigModule } from '@nestjs/config';
import { AdaptersController } from './adapters.controller';
import { KafkaAdapterService } from './clients/kafka/kafka-adapter.service';

@Module({
    imports: [
        ConfigModule,
        KafkaAdapterModule,
    ],
    providers: [
        AdaptersService
    ],
    exports: [
        AdaptersService
    ],
    controllers: [AdaptersController]
})
export class AdaptersModule { }
