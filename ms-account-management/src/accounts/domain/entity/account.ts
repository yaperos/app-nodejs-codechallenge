import { Identification } from './identification';

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface Account {
  userId: string;
  email: string;
  phone: string;
  password: string;
  identification: Identification;
  status: AccountStatus;
  createdAt: Date;
  updatedAt: Date;
}
