import {IsEnum, IsNotEmpty} from 'class-validator';
import {TransactionToVerifyDTO} from './transaction.to.verify.dto';
import {OmitType} from '@nestjs/swagger';
import {TransactionStatus} from 'src/common/transaction.enum';

export class VerifiedTransactionDTO extends OmitType(TransactionToVerifyDTO, [
  'value',
]) {
  @IsEnum(TransactionStatus)
  @IsNotEmpty()
  readonly status: string;
}
