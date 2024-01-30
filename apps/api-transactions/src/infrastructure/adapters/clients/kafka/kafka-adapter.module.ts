import { Module } from '@nestjs/common';
import { KafkaAdapterService } from './kafka-adapter.service';
import { ConfigModule } from '@nestjs/config';

@Module({
    providers: [KafkaAdapterService],
    exports: [KafkaAdapterService],
})
export class KafkaAdapterModule { }
