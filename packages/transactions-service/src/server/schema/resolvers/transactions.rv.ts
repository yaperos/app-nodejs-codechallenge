import TransactionCreationRequestModel from '../../../adapters/in/graphql/models/in/transactionCreationRequest.model'
import TransactionInGraphqlAdapter from '../../../adapters/in/graphql/transactionInGraphql.adapter'
import graphqlErrorHandler from '../../error/grapqhlErrorHandler'

const adapter = new TransactionInGraphqlAdapter()

const TransactionResolvers = {
  Query: {
    transactions: async () => {
      try {
        return await adapter.findAll()
      } catch (error: any) { graphqlErrorHandler(error) }
    },
    transactionByExternalId: async (_: any, args: { transactionExternalId: string }) => {
      try {
        return await adapter.findByExternalId(args.transactionExternalId)
      } catch (error: any) { graphqlErrorHandler(error) }
    }
  },
  Mutation: {
    transaction: async (_: any, { transaction: input }: { transaction: TransactionCreationRequestModel }) => {
      try {
        return await adapter.save(input)
      } catch (error: any) { graphqlErrorHandler(error) }
    }
  }
}

export default TransactionResolvers
