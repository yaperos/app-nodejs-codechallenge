import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Types, TypesDocument } from './types.schema';

@Injectable()
export class TypesRepository implements TypesRepository {
  constructor(
    @InjectModel(Types.name)
    private readonly typesModel: Model<TypesDocument>,
  ) {}

  async getTypes(): Promise<Types[]> {
    try {
      return await this.typesModel.find().exec();
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal Server Error',
        error,
      });
    }
  }

  async getType(id: string): Promise<Types> {
    try {
      return await this.typesModel.findOne({ id }).exec();
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal Server Error',
        error,
      });
    }
  }
}
