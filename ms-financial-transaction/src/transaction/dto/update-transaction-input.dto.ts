import { InputType } from '@nestjs/graphql';
import { IsIn, IsNotEmpty } from 'class-validator';

@InputType()
export class UpdateTransactionInputDto {
  @IsNotEmpty()
  @IsIn(['completed', 'failed'])
  status: 'completed' | 'failed';
}
