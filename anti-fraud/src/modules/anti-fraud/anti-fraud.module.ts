import { Module } from '@nestjs/common';
import { AppConfigModule } from '../@config/app-config.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MAIN_CONSUMER_GROUP, MAIN_SERVICE_NAME } from 'src/app.constants';
import { AppConfigService } from '../@config/app-config.service';
import { AntiFraudBroker } from './anti-fraud.broker';
import { Partitioners } from 'kafkajs';
import { AntiFraudService } from './anti-fraud.service';

@Module({
    imports: [
        AppConfigModule,
        ClientsModule.registerAsync([
            {
                name: MAIN_SERVICE_NAME,
                inject: [AppConfigService],
                useFactory: async (appConfiService: AppConfigService) => {
                    return {
                        transport: Transport.KAFKA,
                        options: {
                            client: {
                                clientId: MAIN_SERVICE_NAME,
                                brokers: [appConfiService.getConfig.KAFKA_BROKER],
                            },
                            producer: {
                                createPartitioner: Partitioners.DefaultPartitioner,
                                allowAutoTopicCreation: true,
                            },
                            consumer: {
                                groupId: MAIN_CONSUMER_GROUP,
                                allowAutoTopicCreation: true
                            }
                        }
                    }
                }
            }
        ])
    ],
    controllers: [AntiFraudBroker],
    providers: [AntiFraudService]
})
export class AntiFraudModule { }