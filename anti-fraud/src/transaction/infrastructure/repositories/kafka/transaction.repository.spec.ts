import { Test, TestingModule } from '@nestjs/testing';
import { TransactionRepositoryImpl } from './transaction.repository';
import { ClientKafka } from '@nestjs/microservices';
import { TransactionRepositoryInterface } from 'src/transaction/domain/interfaces/transaction.repository.interface';
import { Observable } from 'rxjs';

describe('TransactionRepositoryImpl', () => {
  let repository: TransactionRepositoryInterface;
  let mockKafkaClient: Partial<ClientKafka>;

  beforeEach(async () => {
    mockKafkaClient = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionRepositoryImpl,
        {
          provide: 'KAFKA_CLIENT',
          useValue: mockKafkaClient,
        },
      ],
    }).compile();

    repository = module.get<TransactionRepositoryInterface>(
      TransactionRepositoryImpl,
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should send rejected transaction message', async () => {
    // Arrange
    const id = 1;
    const message = 'Rejected transaction';
    jest
      .spyOn(mockKafkaClient, 'emit')
      .mockReturnValueOnce({} as Observable<unknown>);

    // Act
    const result = await repository.sendRejected(id, message);

    // Assert
    expect(mockKafkaClient.emit).toHaveBeenCalledWith(
      'reject_transaction',
      JSON.stringify({ id, message }),
    );
    expect(result).toBe(true);
  });

  it('should fail send rejected transaction message', async () => {
    // Arrange
    const id = 1;
    const message = 'Rejected transaction';
    jest
      .spyOn(mockKafkaClient, 'emit')
      .mockReturnValueOnce(null as Observable<unknown>);

    // Act
    const result = await repository.sendRejected(id, message);

    // Assert
    expect(mockKafkaClient.emit).toHaveBeenCalledWith(
      'reject_transaction',
      JSON.stringify({ id, message }),
    );
    expect(result).toBe(false);
  });

  it('should send approved transaction message', async () => {
    // Arrange
    const id = 1;
    const message = 'Approved transaction';
    jest
      .spyOn(mockKafkaClient, 'emit')
      .mockReturnValueOnce({} as Observable<unknown>);

    // Act
    const result = await repository.sendApproved(id, message);

    // Assert
    expect(mockKafkaClient.emit).toHaveBeenCalledWith(
      'approve_transaction',
      JSON.stringify({ id, message }),
    );
    expect(result).toBe(true);
  });

  it('should fail send approved transaction message', async () => {
    // Arrange
    const id = 1;
    const message = 'Approved transaction';
    jest
      .spyOn(mockKafkaClient, 'emit')
      .mockReturnValueOnce(null as Observable<unknown>);

    // Act
    const result = await repository.sendApproved(id, message);

    // Assert
    expect(mockKafkaClient.emit).toHaveBeenCalledWith(
      'approve_transaction',
      JSON.stringify({ id, message }),
    );
    expect(result).toBe(false);
  });
});
