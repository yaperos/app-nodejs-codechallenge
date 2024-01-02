import { Test } from '@nestjs/testing';
import { v4 as uuidV4 } from 'uuid';
import { of } from 'rxjs';

import { TransactionDto } from '@yape-transactions/shared';
import { TransactionService } from './transaction.service';
import { TRANSACTION_REPOSITORY_PORT_TOKEN, TransactionRepositoryPort } from '../domain/transaction-repository.port';
import { UUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';

describe('TransactionService', () => {
    let service: TransactionService;
    let transactionRepositoryPort: TransactionRepositoryPort;

    const transactionId = uuidV4();

    beforeAll(async () => {
        const app = await Test.createTestingModule({
            imports: [

            ],
            providers: [TransactionService],
        })
            .useMocker(token => {
                if (token === TRANSACTION_REPOSITORY_PORT_TOKEN) {
                    return {
                        createTransaction: (transactionDto: TransactionDto) => {
                            console.log(transactionDto);
                            return of(transactionId);
                        },
                        findTransaction: (transactionId: UUID) => {
                            console.log(transactionId);

                            return of({
                                createdAt: "2024-01-02T14:34:42.417Z",
                                transactionExternalId: "2cdb3e2e-8d17-436f-b48f-df143bc5482a",
                                transactionStatus: {
                                    name: "PENDING"
                                },
                                transactionType: {
                                    name: "1"
                                },
                                value: "$100.00"
                            })
                        }
                    };
                }

            })
            .compile();

        service = app.get<TransactionService>(TransactionService);
        transactionRepositoryPort = app.get<TransactionRepositoryPort>(TRANSACTION_REPOSITORY_PORT_TOKEN);
    });

    afterEach(() => {
        jest.resetAllMocks();
    })
    describe('findTransaction', () => {
        it('should throw exception when entity not found', (done) => {
            jest.spyOn(transactionRepositoryPort, 'findTransaction').mockReturnValue(of(null));

            service.findTransaction({
                transactionId: uuidV4()
            }).subscribe({
                error: (err) => {
                    done();
                    expect(err).toBeInstanceOf(NotFoundException);
                }
            })
        });


    });
});
