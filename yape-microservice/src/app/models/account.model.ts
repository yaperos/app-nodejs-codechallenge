export interface AccountEntity {
  accountExternalId: string;
  firstName: string;
  lastName: string;
  balance: number;
  createdAt: string;
}

export interface CreateAccountRequest {
  firstName: string;
  lastName: string;
  initialBalance: number;
}

export interface UpdateAccountRequest {
  firstName: string;
  lastName: string;
}