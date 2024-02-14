import { InputType, Field } from '@nestjs/graphql';
import { IsValidTypeTransferId } from '../../../shared/decorators/isValidTypeTransferId';
import { IsDefined, IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

@InputType()
export class CreateTransactionInput {
  @Field()
  @IsDefined({
    message: '$property tiene que estar definido',
  })
  @IsNotEmpty({ message: '$property es obligatorio' })
  @IsUUID(4, { message: '$property debe ser un uuid valido' })
  accountExternalIdDebit: string;

  @Field()
  @IsDefined({
    message: '$property tiene que estar definido',
  })
  @IsNotEmpty({ message: '$property es obligatorio' })
  @IsUUID(4, { message: '$property debe ser un uuid valido' })
  accountExternalIdCredit: string;

  @Field()
  @IsDefined({
    message: '$property tiene que estar definido',
  })
  @IsNotEmpty({ message: '$property es obligatorio' })
  @IsNumber({}, { message: '$property debe ser un número' })
  @IsValidTypeTransferId({
    message: '$property con el $value no se reconoce como un id permitido',
  })
  typeId: number;

  @Field()
  @IsDefined({
    message: '$property tiene que estar definido',
  })
  @IsNotEmpty({ message: '$property es obligatorio' })
  @IsNumber({}, { message: '$property debe ser un número' })
  value: number;
}
