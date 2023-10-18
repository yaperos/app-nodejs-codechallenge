import { ITransaction } from './ITransaction';
import { TransactionEntity } from './transaction.entity';

export class CaseMapper {
  // Convertir las claves de camelCase a snake_case
  static keysToSnakeCase(inputObj: Partial<TransactionEntity>): ITransaction {
    const outputObj: Record<string, any> = {};
    for (const key in inputObj) {
      if (inputObj.hasOwnProperty(key)) {
        const newKey = key.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        outputObj[newKey] = inputObj[key];
      }
    }
    return outputObj as ITransaction;
  }

  // Convertir las claves de snake_case a camelCase
  static keysToCamelCase(inputObj: ITransaction): TransactionEntity {
    const outputObj: Record<string, any> = {};
    for (const key in inputObj) {
      if (inputObj.hasOwnProperty(key)) {
        const newKey = key.replace(/([-_][a-z])/g, (group) =>
          group.toUpperCase().replace('-', '').replace('_', ''),
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        outputObj[newKey] = inputObj[key];
      }
    }
    return outputObj as TransactionEntity;
  }
}
