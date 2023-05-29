import { InternalServerErrorException } from '@nestjs/common';
import { TypesService } from './types.service';
import { TypesRepository } from 'src/adapters/database/mongo/types/types.repository';
import {
  Types,
  TypesDocument,
} from 'src/adapters/database/mongo/types/types.schema';
import { Model } from 'mongoose';

describe('TypesService', () => {
  let typesService: TypesService;
  let typesRepository: TypesRepository;
  let mockTypesModel: Partial<Model<Types>>;

  beforeEach(() => {
    mockTypesModel = {
      find: jest.fn().mockReturnThis(),
      findOne: jest.fn().mockReturnThis(),
      exec: jest.fn(),
    } as Partial<Model<Types>>;

    typesRepository = new TypesRepository(
      mockTypesModel as Model<TypesDocument>,
    );

    typesService = new TypesService(typesRepository);
  });

  describe('existTransactionTypes', () => {
    it('should return true if types exist', async () => {
      // Mock the behavior of the typesRepository.getTypes() method
      jest.spyOn(typesRepository, 'getTypes').mockResolvedValueOnce([
        // Array of types
        {
          id: '1',
          name: 'Type 1',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          name: 'Type 2',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const result = await typesService.existTransactionTypes();

      expect(typesRepository.getTypes).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if types do not exist', async () => {
      // Mock the behavior of the typesRepository.getTypes() method
      jest.spyOn(typesRepository, 'getTypes').mockResolvedValueOnce([]);

      const result = await typesService.existTransactionTypes();

      expect(typesRepository.getTypes).toHaveBeenCalled();
      expect(result).toBe(false);
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      // Mock the behavior of the typesRepository.getTypes() method to throw an error
      jest
        .spyOn(typesRepository, 'getTypes')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(typesService.existTransactionTypes()).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(typesRepository.getTypes).toHaveBeenCalled();
    });
  });

  describe('getType', () => {
    it('should return the type with the given ID', async () => {
      const typeId = '1';
      const type = {
        id: typeId,
        name: 'Type 1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      // Mock the behavior of the typesRepository.getType() method
      jest.spyOn(typesRepository, 'getType').mockResolvedValueOnce(type);

      const result = await typesService.getType(typeId);

      expect(typesRepository.getType).toHaveBeenCalledWith(typeId);
      expect(result).toBe(type);
    });

    it('should throw InternalServerErrorException if an error occurs', async () => {
      const typeId = '1';

      // Mock the behavior of the typesRepository.getType() method to throw an error
      jest
        .spyOn(typesRepository, 'getType')
        .mockRejectedValueOnce(new Error('Database error'));

      await expect(typesService.getType(typeId)).rejects.toThrow(
        InternalServerErrorException,
      );
      expect(typesRepository.getType).toHaveBeenCalledWith(typeId);
    });
  });
});
