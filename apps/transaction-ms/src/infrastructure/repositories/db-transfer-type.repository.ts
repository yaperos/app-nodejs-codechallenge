import { DataSource, Repository } from 'typeorm';
import {
  FindTransferTypeEntityResult,
  TransferTypeRepository,
} from '../../domain/repositories/transfer-type.repository';
import { TransferTypeModel } from '../models/transfer-type.model';
import { err, ok } from 'neverthrow';
import { Injectable, Logger } from '@nestjs/common';
import { TransferTypeFindException } from '../../domain/exceptions/transfer-type.exception';

@Injectable()
export class DBTransferTypeRepository
  extends Repository<TransferTypeModel>
  implements TransferTypeRepository
{
  private readonly logger: Logger = new Logger(DBTransferTypeRepository.name);

  constructor(private dataSource: DataSource) {
    super(TransferTypeModel, dataSource.createEntityManager());
  }

  async findTransferType(
    transferTypeId: number,
  ): Promise<FindTransferTypeEntityResult> {
    try {
      const transferType = await this.findOne({
        where: {
          id: transferTypeId,
        },
      });
      if (!transferType) {
        return err(
          new TransferTypeFindException(`not found - ${transferTypeId}`),
        );
      }
      return ok(transferType.toEntity());
    } catch (error) {
      this.logger.error(error.message);
      return err(new TransferTypeFindException(error.message));
    }
  }
}
