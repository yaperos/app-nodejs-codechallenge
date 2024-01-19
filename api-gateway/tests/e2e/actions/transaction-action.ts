import { INestApplication } from '@nestjs/common';
import { Response } from 'supertest';
import {
  IntegerMother,
  UuidMother,
} from 'tests/unit/modules/shared/domain/mothers';
import { FloatMother } from 'tests/unit/modules/shared/domain/mothers/float.mother';

import { Method, requestApi, requestGraphQL } from './base-action';

export const getTransaction = (
  app: INestApplication,
  transactionExternalId: string,
): Promise<Response> => {
  return requestApi({
    app,
    method: Method.GET,
    path: `/transactions/${transactionExternalId}`,
  });
};

export const createTransaction = (
  app: INestApplication,
  {
    accountExternalIdCredit = UuidMother.random(),
    accountExternalIdDebit = UuidMother.random(),
    tranferTypeId = IntegerMother.random({ min: 1, max: 3 }),
    value = FloatMother.random({ min: 1 }),
  }: {
    accountExternalIdCredit?: string;
    accountExternalIdDebit?: string;
    tranferTypeId?: number;
    value?: number;
  },
): Promise<Response> => {
  const body = {
    accountExternalIdCredit,
    accountExternalIdDebit,
    tranferTypeId,
    value,
  };
  return requestApi({ app, method: Method.POST, path: '/transactions/', body });
};

export const transactionQuery = (
  app: INestApplication,
  transactionExternalId: string,
): Promise<Response> => {
  const query = `
    query TestQuery($transactionExternalId: ID!) {
      transaction(transactionExternalId: $transactionExternalId) {
        transactionExternalId
        createdAt
        transactionStatus {
          name
        }
        value
        transactionType {
          name
        }
      }
    }
  `;
  const variables = {
    transactionExternalId,
  };

  return requestGraphQL({
    app,
    query,
    variables,
  });
};

export const createTransactionMutation = (
  app: INestApplication,
  {
    accountExternalIdCredit = UuidMother.random(),
    accountExternalIdDebit = UuidMother.random(),
    tranferTypeId = IntegerMother.random({ min: 1, max: 3 }),
    value = FloatMother.random({ min: 1 }),
  }: {
    accountExternalIdCredit?: string;
    accountExternalIdDebit?: string;
    tranferTypeId?: number;
    value?: number;
  },
): Promise<Response> => {
  const query = `
    mutation TestMutation($createTransactionInput: CreateTransactionInput!) {
      createTransaction(createTransactionInput: $createTransactionInput) {
        createdAt
        transactionExternalId
        transactionStatus {
          name
        }
        transactionType {
          name
        }
        value
      }
    }
  `;

  const variables = {
    createTransactionInput: {
      accountExternalIdDebit,
      accountExternalIdCredit,
      tranferTypeId,
      value,
    },
  };

  return requestGraphQL({
    app,
    query,
    variables,
  });
};
