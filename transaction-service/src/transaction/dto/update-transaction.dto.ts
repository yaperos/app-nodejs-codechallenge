import { IsEnum, IsUUID } from 'class-validator';
import { StatusTransaction } from '../interfaces/status.interface';

export class UpdateTransactionDto {
  @IsEnum(StatusTransaction, {
    message: 'El estado de la transacción es inválido',
  })
  transactionStatus: StatusTransaction;

  @IsUUID()
  transactionExternalId: string;
}
