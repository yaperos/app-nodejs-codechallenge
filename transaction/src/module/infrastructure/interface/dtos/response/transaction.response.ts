import { Exclude, Expose } from 'class-transformer'
import { ValidateNested } from 'class-validator'

@Exclude()
class TransactionType {
  @Expose()
  readonly name: string
}

@Exclude()
export class TransactionStatus {
  @Expose()
  readonly name: string
}

@Exclude()
export class TransactionResponse {
  @Expose()
  readonly transactionExternalId: string

  @Expose()
  @ValidateNested()
  readonly transactionType: TransactionType

  @Expose()
  @ValidateNested()
  readonly transactionStatus: TransactionStatus

  @Expose()
  readonly value: number

  @Expose()
  readonly createdAt: Date
}
