import { DynamicModule, Global, Module } from '@nestjs/common';
import { KafkaService } from './services/kafka.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { KafkaConnectionOptions } from './interfaces/kafka-connection-options';
import { KafkaConnectionProvider } from './providers/kafka-connection.provider';

@Global()
@Module({})
export class KafkaModule {

  static register(options: KafkaConnectionOptions): DynamicModule {

    const kafkaConnectionProvider = KafkaConnectionProvider(options);

    return {
      global: true,
      module: KafkaModule,
      imports: [
        EventEmitterModule.forRoot(),
      ],
      providers: [
        kafkaConnectionProvider,
        KafkaService,
      ],
      exports: [
        KafkaService, 
        kafkaConnectionProvider
      ],

    };
  }
}
