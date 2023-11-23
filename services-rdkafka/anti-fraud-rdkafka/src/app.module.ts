import { Module } from '@nestjs/common';
import { ConsumerModule } from './consumer/consumer.module';
import { KafkaModule } from '@yape/kafka';

@Module({
  imports: [
    KafkaModule.register({
      producer: {
        conf: {
          'bootstrap.servers': 'localhost:9092',
          'security.protocol': 'plaintext',
          'sasl.mechanisms': 'PLAIN',
          'sasl.username': '',
          'sasl.password': '',
        },
      },
      consumer: {
        conf: {
          'group.id': 'anti-fraud-rdk',
          'bootstrap.servers': 'localhost:9092',
          'security.protocol': 'plaintext',
          'sasl.mechanisms': 'PLAIN',
          'sasl.username': '',
          'sasl.password': '',
        },
      },
    }),
    ConsumerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
