import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types } from './types.schema';

@Injectable()
export class TypesSeed {
  constructor(
    @InjectModel(Types.name)
    private readonly typesModel: Model<Types>,
  ) {}

  async seedData(): Promise<void> {
    const data = [
      { id: '1', name: 'credit' },
      { id: '2', name: 'debit' },
    ];

    try {
      await this.typesModel.create(data);
      console.log('Seeding completed successfully.');
    } catch (error) {
      console.error('Seeding failed:', error);
    }
  }
}
