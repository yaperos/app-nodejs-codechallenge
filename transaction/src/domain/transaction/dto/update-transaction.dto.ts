import { Field, InputType, Int, PartialType } from "@nestjs/graphql";
import { CreateTransactionDto } from "./create-transaction.dto";

@InputType()
export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
    @Field()
    id: string;

    @Field(() => Int)
    tranferStatusId: number;
}
