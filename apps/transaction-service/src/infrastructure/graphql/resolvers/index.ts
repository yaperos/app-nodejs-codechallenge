import { DateTimeResolver } from 'graphql-scalars';

import {
  CreateTransactionUseCaseInput,
  RetrieveTransactionUseCaseInput,
} from '../../../core/domain';
import { createTransactionUseCase, retrieveTransactionUseCase } from '../../di';

export const serviceResolvers = {
  DateTime: DateTimeResolver,
  Mutation: {
    createTransaction: (
      _: unknown,
      { input }: { input: CreateTransactionUseCaseInput },
    ) => {
      return createTransactionUseCase.execute(input);
    },
  },
  Query: {
    retrieveTransaction: (
      _: unknown,
      params: RetrieveTransactionUseCaseInput,
    ) => {
      return retrieveTransactionUseCase.execute({
        externalId: params.externalId,
      });
    },
  },
};
