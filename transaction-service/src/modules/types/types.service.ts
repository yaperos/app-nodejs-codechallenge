import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TypesRepository } from 'src/adapters/database/mongo/types/types.repository';
import { Types } from 'src/adapters/database/mongo/types/types.schema';
import { ITypesService } from '../../ports/types/service/types.interface';

@Injectable()
export class TypesService implements ITypesService {
  constructor(private readonly typesRepository: TypesRepository) {}

  async existTransactionTypes(): Promise<boolean> {
    try {
      const types = await this.typesRepository.getTypes();
      return types.length > 0;
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal Server Error',
        error,
      });
    }
  }

  async getType(id: string): Promise<Types> {
    try {
      return await this.typesRepository.getType(id);
    } catch (error) {
      throw new InternalServerErrorException({
        message: 'Internal Server Error',
        error,
      });
    }
  }
}
