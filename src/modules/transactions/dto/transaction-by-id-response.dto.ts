import { Field, Float, ObjectType } from '@nestjs/graphql';
import * as dayjs from 'dayjs';
import { NamedEntityDTO } from 'src/common/dto/named-entity.dto';

@ObjectType()
export class TransactionByIdResponseDTO {
  @Field({
    description: 'UUID of the transaction',
  })
  transactionExternalId: string;

  @Field({ description: "transaction's type information" })
  transactionType: NamedEntityDTO;

  @Field({ description: "transaction's status information" })
  transactionStatus: NamedEntityDTO;

  @Field((_) => Float, { description: "transaction's amount" })
  value: number;

  @Field((_) => String, { description: "transaction's creating date" })
  createdAt: string;

  constructor(
    transactionExternalId: string,
    value: number,
    createdAt: dayjs.Dayjs,
    transactionTypeName: string,
    transactionStatusName: string,
  ) {
    this.transactionExternalId = transactionExternalId;
    this.transactionType = new NamedEntityDTO(transactionTypeName);
    this.transactionStatus = new NamedEntityDTO(transactionStatusName);
    this.value = value;
    this.createdAt = createdAt.format('YYYY-MM-DDTHH:mm:ssZ[Z]');
  }
}
