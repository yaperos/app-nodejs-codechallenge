import { TransactionTypeEnum } from '../../../app/entities/enums/transactionType.enum'
import TransactionEntity from '../../../app/entities/transaction.entity'
import type ITransactionsService from '../../../app/services/transactions.service'
import TransactionsImplementationService from '../../../core/services/transactionImpl.service'
import { databaseInstance, transactionMessageManagerInstance } from '../../../globals'
import { logger } from '../../../shared/imports'
import transactionCreationValidation from '../../../shared/validators/transactionCreation.validator'
import TransactionOutDbAdapter from '../../out/db/transactionOutDb.adapter'
import TransactionsKafkaProducerAdapter from '../../out/producers/transactionsKafka.producer'
import type TransactionCreationRequestModel from './models/in/transactionCreationRequest.model'
import TransactionResponseModel from './models/out/transactionResponse.model'

class TransactionInGraphqlAdapter {
  private readonly location: string = 'TransactionInGraphqlAdapter.ts'
  private readonly transactionsService: ITransactionsService

  constructor () {
    this.transactionsService = new TransactionsImplementationService(
      new TransactionOutDbAdapter(databaseInstance),
      new TransactionsKafkaProducerAdapter(transactionMessageManagerInstance)
    )
  }

  public async save (req: TransactionCreationRequestModel): Promise<TransactionResponseModel> {
    logger.logDebug(`Received call to save transaction with body: ${JSON.stringify(req)}`, this.location)
    transactionCreationValidation(req)
    const { transferTypeId, value, accountExternalIdCredit, accountExternalIdDebit } = req
    if (transferTypeId === undefined || value === undefined) return {} as any

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const externalTransactionId: string = accountExternalIdCredit ?? accountExternalIdDebit!

    const transferType = transferTypeId === 1 ? TransactionTypeEnum.CREDIT : TransactionTypeEnum.DEBIT
    const result = await this.transactionsService.save(new TransactionEntity(externalTransactionId, value, transferType))
    logger.logDebug('Execution call finished', this.location)

    return new TransactionResponseModel(result)
  }

  public async findAll (): Promise<TransactionResponseModel[]> {
    logger.logDebug('Received call to findAll transactions', this.location)
    const result = (await this.transactionsService.findAll()).map(t => new TransactionResponseModel(t))
    logger.logDebug('Execution call finished', this.location)
    return result
  }

  public async findByExternalId (externalId: string): Promise<TransactionResponseModel> {
    logger.logDebug('Received call to findByExternalId transaction', this.location)
    const result = await this.transactionsService.findByExternalId(externalId)
    logger.logDebug('Execution call finished', this.location)
    return new TransactionResponseModel(result)
  }
}

export default TransactionInGraphqlAdapter
