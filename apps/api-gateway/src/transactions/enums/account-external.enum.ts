import { registerEnumType } from '@nestjs/graphql';

export enum AccountExternalNameEnum {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

registerEnumType(AccountExternalNameEnum, {
  name: 'AccountExternalNameEnum',
  description: 'Types of an account external',
});
