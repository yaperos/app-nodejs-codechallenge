import { GraphQLError } from 'graphql';
import { resolvers as scalarResolvers } from 'graphql-scalars';
import logger from "../logger";
import { ArgsTransaction, ETypeEventTransaction, contextTransaction, typeSearchTransaction } from "../@types";
import transactionRepository from '../repositories/transactionRepository';

export const resolvers = {
    ...scalarResolvers,
    Query: {
        searchTransaction: async(_ : any, { transactionId }: typeSearchTransaction, ctx:any) =>  {
            const transaction = await transactionRepository.get(transactionId)
            if (!transaction) {
                throw new GraphQLError('Transaction not found', {
                    extensions: {
                        code: 404,
                    },
                });
            }

            return {
                success: true,
                message: "Transaction found",
                code: 200,
                result: transaction
            }
        },
        allTransaction: async(_ : any, { }, ctx:any) =>  {
            return await transactionRepository.all();
        }
    },
    Mutation: {
        createTransaction: async (_:any, { input }: ArgsTransaction, { producer }: contextTransaction) => { 
            await producer.call(input, ETypeEventTransaction.EVENT_NEW_TRANSACTION);
            logger.info(`[EXECUTED] ${ETypeEventTransaction.EVENT_NEW_TRANSACTION}`)

            return {
                success: true,
                message: "Transaction created",
                code: 201
            }
        }
    }
}