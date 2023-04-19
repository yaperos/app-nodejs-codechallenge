import { Field, InputType} from '@nestjs/graphql';
import { IsNotEmpty} from 'class-validator';


@InputType()
export class CreateTransactionWithGraphql {

  @Field({ nullable: true })
  accountExternalIdDebit?: string | null;

  @Field({ nullable: true })
  accountExternalIdCredit?: string | null;

  @Field()
  @IsNotEmpty()
  transferTypeId: number;

  @Field()
  @IsNotEmpty()
  value: number;
}
