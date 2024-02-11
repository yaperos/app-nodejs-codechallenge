import { IsDefined, IsNotEmpty, IsUUID } from 'class-validator';
import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class FindTransactionArgs {
  @Field()
  @IsDefined({
    message: '$property tiene que estar definido',
  })
  @IsNotEmpty({ message: '$property es obligatorio' })
  @IsUUID(4, { message: '$property debe ser un uuid valido' })
  transactionId: string;
}
