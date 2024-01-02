import { Inject, Service } from "typedi";
import { Query, Resolver, Mutation, Arg } from "type-graphql"
import { v4 as uuidv4} from "uuid";
import { KafkaProducerService } from "@common-txn/di";
import { TxnInput, TxnResponse } from "../schemas"

@Service()
@Resolver(() => TxnResponse)
export class TxnResolver {

  constructor(
    @Inject("CreateTXNProducer") private producer: KafkaProducerService
  ){}

  @Query(() => TxnResponse)
  async getTxn(@Arg("id") transactionExternalId: string): Promise<TxnResponse | undefined> {
    const response: TxnResponse = {
      transactionExternalId,
      value: 20,
      createdAt: "now"
    }
    return response
  }

  @Mutation(() => TxnResponse)
  async createTxn(@Arg("input") input: TxnInput): Promise<TxnResponse> {
    const txnId = uuidv4();
    const response: TxnResponse = {
      transactionExternalId: txnId,
      value: input.value,
      createdAt: "now"
    }

    await this.producer.sendMessage(txnId, JSON.stringify(input));

    return response
  }
}
