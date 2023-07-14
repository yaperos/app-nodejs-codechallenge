import { Result } from 'neverthrow';
import { TransferTypeEntity } from '../entities/transfer-type.entity';
import { TransferTypeFindException } from '../exceptions/transfer-type.exception';

export type FindTransferTypeEntityResult = Result<
  TransferTypeEntity,
  TransferTypeFindException
>;

export interface TransferTypeRepository {
  findTransferType(
    transferTypeId: number,
  ): Promise<FindTransferTypeEntityResult>;
}
