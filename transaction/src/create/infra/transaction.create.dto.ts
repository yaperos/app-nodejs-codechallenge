import { TransactionStatusUpdatetDto } from 'src/update-status/app/transaction.update.dto';
import { IsNotEmpty, IsNumber, IsOptional, IsUUID } from 'class-validator';
import { TransactionCreateInput } from '../app/transaction.create.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TransactionCreateInputDto implements TransactionCreateInput {
  @ApiProperty({
    required: false,
    example: 'ef6990f2-7d00-43bd-880d-fbe6220f1e83',
  })
  @IsOptional()
  @Field({ nullable: true })
  id?: string;

  @ApiProperty({ example: 'ef6990f2-7d00-43bd-880d-fbe6220f1e82' })
  @IsUUID()
  @IsNotEmpty()
  @Field()
  accountExternalIdDebit: string;

  @ApiProperty({ example: '83138fba-ada6-4478-8c75-5b9e921521dd' })
  @IsUUID()
  @IsNotEmpty()
  @Field()
  accountExternalIdCredit: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Field()
  transactionTypeId: number;

  @ApiProperty({ example: 100 })
  @IsNumber()
  @Field()
  value: number;
}

export class AntiFraudTransactionStatusEventDto
  implements TransactionStatusUpdatetDto
{
  id: string;
  rejected: boolean;
}
