import {KafkaService} from "@/config/bus/kafka/kafka.service";
import {ClientProxy} from "@nestjs/microservices";
import {Test, TestingModule} from "@nestjs/testing";
import {ConfigService} from "@nestjs/config";
import {LoggerService} from "@/config/logger/logger.service";
import {TracerService} from "@/config/tracer/tracer.service";
import {TransactionDto} from "@/contexts/transaction/dto/transaction.dto";

import { transaction, headers, uuidMock } from '../../mocks/transaction';


const metadata = {
    commerce: headers.commerce,
    channel: headers.channel,
    eventId: uuidMock,
    entityId: transaction.accountExternalIdCredit,
};
const data = transaction as TransactionDto;
import { of, throwError } from 'rxjs';
import {CreateTransaction} from "@/contexts/transaction/events/create.transaction";
const results = { mock: true };

describe('kafkaService', () => {
    let service: KafkaService;
    let client: ClientProxy;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                {
                    provide: 'KAFKA_SERVICE',
                    useValue: {
                        emit: jest.fn(),
                    },
                },
                ConfigService,
                {
                    provide: ConfigService,
                    useValue: { get: jest.fn().mockResolvedValueOnce('test') },
                },
                KafkaService,
            ],
        })
            .useMocker((token) => {
                if (token === LoggerService) {
                    return {
                        log: jest.fn().mockResolvedValue(results),
                        error: jest.fn().mockResolvedValue(results),
                    };
                }
                if (token === TracerService) {
                    return { getTrace: jest.fn().mockResolvedValue(uuidMock) };
                }
                if (token === ClientProxy) {
                    return { emit: jest.fn().mockResolvedValue({ test: 'test' }) };
                }
                if (token === 'KAFKA_SERVICE') {
                    return { emit: jest.fn().mockResolvedValue({ test: 'test' }) };
                }
            })
            .compile();

        client = module.get<ClientProxy>('KAFKA_SERVICE');
        service = module.get<KafkaService>(KafkaService);

        expect(module).toBeDefined();
        expect(module.get(KafkaService)).toBeInstanceOf(KafkaService);
    });

    it('should be defined', async () => {
        expect(service).toBeDefined();
    });

    it('should emit successfully', async () => {
        const createTransactionEvent = new CreateTransaction(data, metadata );
        jest.spyOn(client, 'emit').mockImplementationOnce(() => of(results));
        const response = await service.emit(createTransactionEvent);
        expect(response).toEqual({data: transaction, metadata: createTransactionEvent.getAttributes()});
    });

    it('should fail to emit', async () => {
        const createGuideEvent = new CreateTransaction(data, metadata);
        jest.spyOn(client, 'emit').mockImplementationOnce(() => throwError(results));
        await expect(service.emit(createGuideEvent)).rejects.toBeDefined();
    });
});
