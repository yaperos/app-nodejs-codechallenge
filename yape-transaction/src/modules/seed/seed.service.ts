import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  TransactionStatusEnum,
  TransactionTypeEnum,
} from '@core/config/constants';
import { TransactionStatus, TransactionType } from '../transaction';
import { seedInit } from '@core/config/environment';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(TransactionStatus)
    private readonly transactionStatusRepository: Repository<TransactionStatus>,
    @InjectRepository(TransactionType)
    private readonly transactionTypeRepository: Repository<TransactionType>,
  ) {}

  async onModuleInit(): Promise<void> {
    if (!seedInit) {
      return null;
    }

    try {
      this.logger.log('Initializing Seed Module');
      const initDataStatus = [
        {
          id: 1,
          name: TransactionStatusEnum.PENDING,
        },
        {
          id: 2,
          name: TransactionStatusEnum.APPROVED,
        },
        {
          id: 3,
          name: TransactionStatusEnum.REJECTED,
        },
      ];

      await this.transactionStatusRepository.save([...initDataStatus]);

      const initDataType = [
        {
          id: 1,
          name: TransactionTypeEnum.TYPE_1,
        },
        {
          id: 2,
          name: TransactionTypeEnum.TYPE_2,
        },
        { id: 3, name: TransactionTypeEnum.TYPE_3 },
      ];

      await this.transactionTypeRepository.save([...initDataType]);

      this.logger.log('Finalized Seeding');
    } catch (error) {
      this.logger.error('Seed Module Error');
      this.logger.error(error);
    }
  }
}
