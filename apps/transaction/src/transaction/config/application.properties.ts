import { Injectable } from '@nestjs/common/decorators/core/injectable.decorator';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApplicationProperties {

    constructor(
        private readonly configService: ConfigService
    ){}

    getTransactionTopicName() : number {
        return this.configService.get<number>('application.kafka.transaction-topic-name');
    }
}