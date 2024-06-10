import * as hooks from './hooks'

export const resolvers = {
  Query: {
    transactions: async () => await hooks.getTransactions()
  }
}
