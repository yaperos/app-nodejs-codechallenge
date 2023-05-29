import { Types } from 'src/adapters/database/mongo/types/types.schema';

export interface ITypesService {
  existTransactionTypes(): Promise<boolean>;
  getType(id: string): Promise<Types>;
}
