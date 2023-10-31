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
      _: any,
      { input }: { input: CreateTransactionUseCaseInput },
    ) => {
      return createTransactionUseCase.execute(input);
    },
  },
  Query: {
    retrieveTransaction: (_: any, params: RetrieveTransactionUseCaseInput) => {
      return retrieveTransactionUseCase.execute({
        externalId: params.externalId,
      });
    },
  },
};
