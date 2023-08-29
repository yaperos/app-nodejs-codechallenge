import { Injectable } from '@nestjs/common';
import { TransferType } from 'src/entities/transferType';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class TransferTypeRepository extends Repository<TransferType> {
  constructor(private dataSource: DataSource) {
    super(TransferType, dataSource.createEntityManager());
  }

  async getById(id: number): Promise<TransferType> {
    return await this.dataSource
      .createQueryBuilder(TransferType, 't')
      .where('id = :id', {
        id,
      })
      .getOne();
  }
}
