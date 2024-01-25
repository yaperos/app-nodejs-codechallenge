import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TransferType } from '../entities/transaction-type.entity';

@Injectable()
export class TransferTypeService implements OnModuleInit {
  constructor(
    @InjectRepository(TransferType)
    private transferTypeRepository: Repository<TransferType>,
  ) {}

  async onModuleInit() {
    const types = [{ name: 'Tipo 1' }, { name: 'Tipo 2' }, { name: 'Tipo 3' }];

    for (const typeData of types) {
      let type = await this.transferTypeRepository.findOne({
        where: { name: typeData.name },
      });

      if (!type) {
        type = this.transferTypeRepository.create(typeData);
        await this.transferTypeRepository.save(type);
      }
    }
  }
}
