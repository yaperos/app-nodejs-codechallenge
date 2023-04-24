import {ClientProxy} from "@nestjs/microservices";
import {Test, TestingModule} from "@nestjs/testing";
import {ConfigService} from "@nestjs/config";
import { transaction, headers, uuidMock } from '../../mocks/transaction';
import { of, throwError } from 'rxjs';
import {TransactionDto} from "../../../../src/contexts/antifraud/dto/transaction.dto";
import {KafkaService} from "../../../../src/config/bus/kafka/kafka.service";
import {LoggerService} from "../../../../src/config/logger/logger.service";
import {TracerService} from "../../../../src/config/tracer/tracer.service";
import {CreateAntiFraud} from "../../../../src/contexts/antifraud/events/create.antiFraud";


const results = { mock: true };

const metadata = {
    commerce: headers.commerce,
    channel: headers.channel,
    eventId: uuidMock,
    entityId: transaction.accountExternalIdCredit,
    eventType: 'approved'
};
const data = transaction as TransactionDto;


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
        const createTransactionEvent = new CreateAntiFraud(data, metadata );
        jest.spyOn(client, 'emit').mockImplementationOnce(() => of(results));
        const response = await service.emit(createTransactionEvent);
        expect(response).toEqual({data: transaction, metadata: createTransactionEvent.getAttributes()});
    });

    it('should fail to emit', async () => {
        const createGuideEvent = new CreateAntiFraud(data, metadata);
        jest.spyOn(client, 'emit').mockImplementationOnce(() => throwError(results));
        await expect(service.emit(createGuideEvent)).rejects.toBeDefined();
    });
});
