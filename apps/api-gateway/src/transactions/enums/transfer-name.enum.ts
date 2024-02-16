import { registerEnumType } from '@nestjs/graphql';

export enum TransferNameEnum {
  NATIONAL = 'NATIONAL',
  INTERNATIONAL = 'INTERNATIONAL',
}

registerEnumType(TransferNameEnum, {
  name: 'TransferNameEnum',
  description: 'Types of a transfer',
});
