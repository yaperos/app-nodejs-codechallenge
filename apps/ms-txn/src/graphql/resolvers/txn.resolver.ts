import { Inject, Service } from "typedi"
import { Query, Resolver, Mutation, Arg } from "type-graphql"
import { EntityManager } from "typeorm"
import { KafkaProducerService } from "@common-txn/service"
import { ITransaction } from "@common-txn/domain"
import { TxnInput, TxnResponse } from "../schemas"
import { Transaction } from "@common-txn/datasource"

@Service()
@Resolver(() => TxnResponse)
export class TxnResolver {

  constructor(
    @Inject("validateTxnProducer") private producer: KafkaProducerService,
    @Inject("txnManager") private entity: EntityManager
  ){}

  @Query(() => TxnResponse)
  async getTxn(@Arg("id") transactionExternalId: string): Promise<TxnResponse | undefined> {
    const txnData = await this.entity.findOneBy(Transaction, {
      transactionExternalId
    })

    return txnData ? new TxnResponse(txnData as ITransaction) : undefined
  }

  @Mutation(() => TxnResponse)
  async createTxn(@Arg("input") input: TxnInput): Promise<TxnResponse> {
    const txnData = this.entity.create(Transaction, { ...input })
    await this.entity.save(txnData)
    await this.producer.sendMessage(txnData.transactionExternalId, JSON.stringify(txnData))

    return txnData
  }
}
