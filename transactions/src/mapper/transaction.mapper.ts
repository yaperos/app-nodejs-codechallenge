import { Transaction } from '../transaction.entity';
import { TransactionDto } from '../dto/transaction.dto';

export class TransactionMapper {
  public static entityToDto(entity: Transaction): TransactionDto {
    return new TransactionDto(
      entity.transactionExternalId,
      entity.transferTypeId,
      entity.value,
      entity.status,
      entity.createdAt,
    );
  }

  public static entityListToDtoList(
    entityList: Array<Transaction>,
  ): Array<TransactionDto> {
    return entityList.map((entity) => this.entityToDto(entity));
  }
}
