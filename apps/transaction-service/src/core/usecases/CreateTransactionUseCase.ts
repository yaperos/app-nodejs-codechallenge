import {
  CreateTransactionUseCaseInput,
  CreateTransactionUseCaseOutput,
  EventEmitter,
  TransactionParserService,
  TransactionRepository,
  TransactionTypeRepository,
} from '../domain';

type CreateTransactionUseCaseParams = {
  eventEmitter: EventEmitter;
  transactionRepository: TransactionRepository;
  transactionTypeRepository: TransactionTypeRepository;
  parserService: TransactionParserService;
};

export class CreateTransactionUseCase {
  private readonly eventEmitter: EventEmitter;
  private readonly transactionRepository: TransactionRepository;
  private readonly transactionTypeRepository: TransactionTypeRepository;
  private readonly parserService: TransactionParserService;

  constructor({
    eventEmitter,
    parserService,
    transactionRepository,
    transactionTypeRepository,
  }: CreateTransactionUseCaseParams) {
    this.eventEmitter = eventEmitter;
    this.transactionRepository = transactionRepository;
    this.parserService = parserService;
    this.transactionTypeRepository = transactionTypeRepository;
  }

  private validate(port: CreateTransactionUseCaseInput): void {
    if (!port.accountExternalIdCredit) {
      throw new Error('ACCOUNT_EXTERNAL_ID_CREDIT_NOT_DEFINED');
    }

    if (!port.accountExternalIdDebit) {
      throw new Error('ACCOUNT_EXTERNAL_ID_DEBIT_NOT_DEFINED');
    }

    if (!port.tranferTypeId) {
      throw new Error('TRANSFER_TYPE_ID_NOT_DEFINED');
    }
  }

  async execute(
    port: CreateTransactionUseCaseInput,
  ): Promise<CreateTransactionUseCaseOutput> {
    this.validate(port);

    const transactionType = await this.transactionTypeRepository.getById(
      port.tranferTypeId,
    );

    if (!transactionType) {
      throw new Error('TRANSACTION_TYPE_NOT_VALID');
    }

    const transaction = await this.transactionRepository.insert({
      accountExternalIdCredit: port.accountExternalIdCredit,
      accountExternalIdDebit: port.accountExternalIdDebit,
      transactionType,
      value: port.value,
    });

    await this.eventEmitter.sendCreatedTransactionEvent({
      id: transaction.id,
      value: port.value,
    });

    return this.parserService.parse(transaction);
  }
}
