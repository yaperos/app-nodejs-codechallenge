import { Types } from 'src/adapters/database/mongo/types/types.schema';

export interface ITypesService {
  getTypes(): Promise<Types[]>;
  getType(id: string): Promise<Types>;
}
