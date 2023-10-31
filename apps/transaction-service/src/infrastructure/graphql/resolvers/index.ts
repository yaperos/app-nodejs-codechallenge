import { DateTimeResolver } from 'graphql-scalars';

import { CreateTransactionUseCaseInput } from '../../../core/domain';
import { createTransactionUseCase } from '../../di';

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
};
