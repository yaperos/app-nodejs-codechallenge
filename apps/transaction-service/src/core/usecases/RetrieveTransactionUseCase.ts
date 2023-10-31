import {
  RetrieveTransactionUseCaseInput,
  RetrieveTransactionUseCaseOutput,
  TransactionParserService,
  TransactionRepository,
} from '../domain';

type RetrieveTransactionUseCaseParams = {
  transactionRepository: TransactionRepository;
  parserService: TransactionParserService;
};

export class RetrieveTransactionUseCase {
  private readonly transactionRepository: TransactionRepository;
  private readonly parserService: TransactionParserService;

  constructor({
    parserService,
    transactionRepository,
  }: RetrieveTransactionUseCaseParams) {
    this.parserService = parserService;
    this.transactionRepository = transactionRepository;
  }

  private validate(port: RetrieveTransactionUseCaseInput): void {
    if (!port.externalId) {
      throw new Error('TRANSACTION_EXTERNAL_ID_MISSING');
    }
  }

  async execute(
    port: RetrieveTransactionUseCaseInput,
  ): Promise<RetrieveTransactionUseCaseOutput> {
    this.validate(port);

    const transaction = await this.transactionRepository.get(port.externalId);

    return this.parserService.parse(transaction);
  }
}
