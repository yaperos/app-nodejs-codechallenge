import { Injectable } from '@nestjs/common';
import { TransferType } from 'src/entities/transferType';
import { DataSource } from 'typeorm';

@Injectable()
export class TransferTypeFactory {
  static async create(
    args: Partial<TransferType>,
    dataSource: DataSource,
  ): Promise<TransferType> {
    const transferType = new TransferType();
    transferType.id = 1;
    Object.assign(transferType, args);

    return await dataSource.getRepository(TransferType).save(transferType);
  }
}
