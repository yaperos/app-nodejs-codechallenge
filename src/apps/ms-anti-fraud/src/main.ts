import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AntiFraudModule } from './ms-anti-fraud.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AntiFraudModule)
  const configService: ConfigService = app.get(ConfigService)
  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(
    AntiFraudModule,
    {
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: [configService.get('KAFKA_BROKER_URL')],
          },
          consumer: {
            groupId: configService.get('KAFKA_ANTI_FRAUD_CONSUMER_ID'),
          },
        },
      }
  )
  await microservice.listen()
}
bootstrap()
