import { Test, TestingModule } from '@nestjs/testing';
import { AntiFraudMessageController } from '../src/infrastructure/controllers/anti-fraud.message.controller';
import { ProcessTransactionUseCase } from '../src/application/use-cases/process-transaction.usecase';
import { KafkaProducer } from '../src/infrastructure/kafka/kafka.producer';
import { TransactionModel } from '../src/domain/models/transaction.model';

describe('AntiFraudMessageController', () => {
  let controller: AntiFraudMessageController;
  let processTransactionUseCase: jest.Mocked<ProcessTransactionUseCase>;
  let kafkaProducer: jest.Mocked<KafkaProducer>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AntiFraudMessageController],
      providers: [
        {
          provide: ProcessTransactionUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: KafkaProducer,
          useValue: {
            onModuleInit: jest.fn(),
            send: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AntiFraudMessageController>(AntiFraudMessageController);
    processTransactionUseCase = module.get(ProcessTransactionUseCase);
    kafkaProducer = module.get(KafkaProducer);
  });

  it('debe procesar el mensaje y enviar un evento con el estado actualizado', async () => {
    processTransactionUseCase.execute.mockResolvedValue('APPROVED');

    const mockMessage = {
      value: {
        transactionExternalId: 'test-123',
        value: 500,
        accountExternalIdDebit: 'deb-001',
        accountExternalIdCredit: 'cred-002',
        transactionStatus: 'PENDING',
        createdAt: new Date(),
      } as TransactionModel,
    };

    await controller.handleTransactionCreated(mockMessage);

    expect(processTransactionUseCase.execute).toHaveBeenCalledWith(mockMessage.value);
    expect(kafkaProducer.send).toHaveBeenCalledWith('transaction-status-updated-topic', {
      transactionExternalId: 'test-123',
      status: 'APPROVED',
    });
  });
});
