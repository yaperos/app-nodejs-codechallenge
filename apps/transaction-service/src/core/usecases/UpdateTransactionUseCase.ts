import {
  TransactionParserService,
  TransactionRepository,
  TransactionStatusValues,
  UpdateTransactionUseCaseInput,
  UpdateTransactionUseCaseOutput,
} from '../domain';

type UpdateTransactionUseCaseParams = {
  transactionRepository: TransactionRepository;
  parserService: TransactionParserService;
};

export class UpdateTransactionUseCase {
  private readonly transactionRepository: TransactionRepository;
  private readonly parserService: TransactionParserService;

  constructor({
    parserService,
    transactionRepository,
  }: UpdateTransactionUseCaseParams) {
    this.transactionRepository = transactionRepository;
    this.parserService = parserService;
  }

  private validate(port: UpdateTransactionUseCaseInput): void {
    if (!port.id) {
      throw new Error('TRANSACTION_ID_NOT_DEFINED');
    }

    if (!TransactionStatusValues.includes(port.status)) {
      throw new Error('TRANSACTION_STATUS_NOT_VALID');
    }
  }

  async execute(
    port: UpdateTransactionUseCaseInput,
  ): Promise<UpdateTransactionUseCaseOutput> {
    this.validate(port);

    const transaction = await this.transactionRepository.update(port.id, {
      annotations: port.errorMessage,
      status: port.status,
    });

    return this.parserService.parse(transaction);
  }
}
