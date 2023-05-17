import { CreateAntiFraudServiceDto } from './dto/create-anti-fraud-service.dto';
import { Transaction } from './entities/transaction.service.entity';
import { Observer } from './Observer/transation.observer';
import { ClientKafka } from '@nestjs/microservices';
export declare class AntiFraudServiceService implements Observer {
    private readonly client;
    constructor(client: ClientKafka);
    create(createAntiFraudServiceDto: CreateAntiFraudServiceDto): void;
    update(transaction: Transaction): void;
    private publish;
}
