import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TransferTypeModel } from './infrastructure/models/transfer-type.model';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  onApplicationBootstrap() {
    const repository = this.dataSource.getRepository(TransferTypeModel);
    const data = [
      {
        id: 1,
        name: 'DEBIT',
      },
      {
        id: 2,
        name: 'CREDIT',
      },
    ];

    for (const element of data) {
      const typeDebit = new TransferTypeModel();
      typeDebit.id = element.id;
      typeDebit.name = element.name;
      repository.save(typeDebit);
    }
  }
}
