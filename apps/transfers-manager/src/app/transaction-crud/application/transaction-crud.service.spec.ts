import { Test } from '@nestjs/testing';
import { v4 as uuidV4 } from 'uuid';

import { ConfigModule } from '@nestjs/config';
import { TransactionDto } from '@yape-transactions/shared';
import { TransactionCrudService } from './transaction-crud.service';
import { CREATE_TRANSACTION_PORT_TOKEN } from '../domain/create-transaction.port';
import { of } from 'rxjs';
import { ANTI_FRAUD_SERVICE_PORT_TOKEN, AntiFraudServicePort } from '../domain/anti-fraud-service.port';
import { AntiFraudServiceCommand } from '../domain/anti-fraud-service.command';

const commonConfig = () => ({
    amountApprovedTX: 1000
});

describe('TransactionCrudService', () => {
    let service: TransactionCrudService;
    let antiFraudPort: AntiFraudServicePort;

    const transactionId = uuidV4();

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    load: [commonConfig],
                    isGlobal: true,
                }),
            ],
            providers: [TransactionCrudService],
        })
            .useMocker(token => {
                if (token === CREATE_TRANSACTION_PORT_TOKEN) {
                    return {
                        createTransaction: (transactionDto: TransactionDto) => {
                            console.log(transactionDto);
                            return of(transactionId);
                        },
                    };
                }
                if (token === ANTI_FRAUD_SERVICE_PORT_TOKEN) {
                    return {
                        triggerAntiFraudService: (command: AntiFraudServiceCommand) => {
                            console.log(command);
                            console.log('executing triggerAntiFraudService');
                        }
                    }
                }
            })
            .compile();

        service = app.get<TransactionCrudService>(TransactionCrudService);
        antiFraudPort = app.get<AntiFraudServicePort>(ANTI_FRAUD_SERVICE_PORT_TOKEN);
    });

    afterEach(() => {
        jest.resetAllMocks();
    })
    describe('createTransaction', () => {
        it('should call triggerAntiFraudService', (done) => {
            jest.spyOn(antiFraudPort, 'triggerAntiFraudService');

            service.createTransaction({
                transactionData: {
                    accountExternalIdCredit: uuidV4(),
                    accountExternalIdDebit: uuidV4(),
                    tranferTypeId: 1,
                    value: 100
                }
            }).subscribe({
                next: (result) => {
                    done();
                    expect(result).toBe(transactionId);
                    expect(antiFraudPort.triggerAntiFraudService).toHaveBeenCalled()
                }
            })
        });


    });
});
