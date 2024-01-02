import { Test } from '@nestjs/testing';
import { v4 as uuidV4 } from 'uuid';

import { ConfigModule } from '@nestjs/config';
import { TransactionDto, TransactionEntity, TransactionResult, TransactionStatusEnum } from '@yape-transactions/shared';
import { CREATE_TRANSACTION_PORT_TOKEN } from '../domain/create-transaction.port';
import { of } from 'rxjs';
import { ANTI_FRAUD_SERVICE_PORT_TOKEN, AntiFraudServicePort } from '../domain/anti-fraud-service.port';
import { AntiFraudServiceCommand } from '../domain/anti-fraud-service.command';
import { GetTransactionDbAdapter } from './get-transaction.db.adapater';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';


describe('GetTransactionDbAdapter', () => {
    let getTransactionDbAdapter: GetTransactionDbAdapter;
    let repository: Repository<TransactionEntity>;

    const transactionId = uuidV4();
    const mockResulrDbRow = new TransactionEntity();
    mockResulrDbRow.transactionId = transactionId;
    mockResulrDbRow.accountExternalIdCredit = uuidV4();
    mockResulrDbRow.accountExternalIdDebit = uuidV4();
    mockResulrDbRow.createDateTime = new Date('2024-01-02T13:52:47');
    mockResulrDbRow.status = TransactionStatusEnum.PENDING;
    mockResulrDbRow.tranferTypeId = 1;
    mockResulrDbRow.value = 100;


    beforeAll(async () => {
        const app = await Test.createTestingModule({
            imports: [

            ],
            providers: [GetTransactionDbAdapter],
        })
            .useMocker(token => {
                console.log('------ token ----', token);
                if (token === getRepositoryToken(TransactionEntity)) {
                    return {
                        findOneBy: () => {
                            return Promise.resolve(
                                mockResulrDbRow
                            );
                        }
                    }
                }
            })
            .compile();

        getTransactionDbAdapter = app.get<GetTransactionDbAdapter>(GetTransactionDbAdapter);
        repository = app.get<Repository<TransactionEntity>>(getRepositoryToken(TransactionEntity));
    });

    afterEach(() => {
        jest.resetAllMocks();
    })
    describe('getTransactionDbAdapter', () => {
        it('should return TransactionResult', (done) => {

            getTransactionDbAdapter.findTransactionById({
                transactionId
            }).subscribe({
                next: (result) => {
                    done();
                    expect(result).toEqual({
                        transactionExternalId: transactionId,
                        createdAt: mockResulrDbRow.createDateTime,
                        transactionStatus: {
                            name: mockResulrDbRow.status
                        },
                        transactionType: {
                            name: '' + mockResulrDbRow.tranferTypeId
                        },
                        value: mockResulrDbRow.value
                    } as TransactionResult);
                }
            })
        });


        it('should return null when row not found', (done) => {

            jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);
            getTransactionDbAdapter.findTransactionById({
                transactionId
            }).subscribe({
                next: (result) => {
                    done();
                    expect(result).toBeNull();
                }
            })
        });

    });
});
