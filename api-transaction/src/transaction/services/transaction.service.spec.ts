import { ClientKafka } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { TransactionService } from './transaction.service';
import { AntifraudKafkaConfigService, AntifraudKafkaModule } from 'src/common/config/kafka';
import { EnvironmentModule } from 'src/common/config/environment';
import { TransactionModule } from '../transaction.module';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionInput } from '../dto';

describe('TransactionService', () => {
  let service: TransactionService;
  let repositoryMock: any;
  let antifraudClientMock: Partial<ClientKafka>;

  beforeEach(async () => {
    // Mockear el repositorio y el cliente de Kafka
    repositoryMock = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      preload: jest.fn(),
    };

    antifraudClientMock = {
      emit: jest.fn(),
    };

    // Configurar el módulo de prueba
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: 'ANTIFRAUD_SERVICE',
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: repositoryMock,
        },
      ],
    }).compile();

    // Obtener una instancia del servicio
    service = module.get<TransactionService>(TransactionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new transaction', async () => {
      // Arrange
      const createTransactionInput: CreateTransactionInput = {
        "accountExternalIdCredit": "550e8400-e29b-41d4-a716-446655440000",
        "accountExternalIdDebit": "550e8400-e29b-41d4-a716-446655440000",
        "tranferTypeId": 1,
        "value": 1000
      }
      const savedTransaction = { id: '1', ...createTransactionInput };

      // Configurar el comportamiento del repositorio
      repositoryMock.create.mockReturnValue(createTransactionInput);
      repositoryMock.save.mockResolvedValue(savedTransaction);

      // Act
      const result = await service.create(createTransactionInput);

      // Assert
      expect(result).toEqual(savedTransaction);
      expect(repositoryMock.create).toHaveBeenCalledWith(createTransactionInput);
      expect(repositoryMock.save).toHaveBeenCalledWith(createTransactionInput);
      expect(antifraudClientMock.emit).toHaveBeenCalledWith('transaction.created', JSON.stringify({
        id: '1',
        value: createTransactionInput.value,
      }));
    });
  });


});
