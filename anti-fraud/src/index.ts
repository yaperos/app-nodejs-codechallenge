import { AntiFraudService } from './application/anti-fraud.service';
import { KafkaClient } from './infrastructure/kafka/kafka.client';

async function bootstrap() {
  const transactionService = new AntiFraudService(new KafkaClient());

  transactionService.handleValidateValueEvent();
}

bootstrap();
