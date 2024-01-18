import { ArgsTransaction, ETypeEventTransaction, contextTransaction, typeSearchTransaction } from "../@types";
import logger from "../logger";
import transactionModel from "../models/transactionModel";

export const resolvers = { 
    Query: {
        searchTransaction: async(_ : any, { transactionId }: typeSearchTransaction, ctx:any) =>  {
            const transaction = await transactionModel.findOne({ 
                transactionExternalId: transactionId,
            });

            return transaction;
        }
    },
    Mutation: {
        createTransaction: async (_:any, { input }: ArgsTransaction, { producer }: contextTransaction) => { 

            await producer.call(input, ETypeEventTransaction.EVENT_NEW_TRANSACTION);
            logger.info(`[EXECUTED] ${ETypeEventTransaction.EVENT_NEW_TRANSACTION}`)

        }
    }
}