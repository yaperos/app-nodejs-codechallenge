import {CreateTransactionHandler} from "../../handlers/create-transaction-handler";
import {GetTransactionHandler} from "../../handlers/get-transaction-handler";

const createTransactionHandler = new CreateTransactionHandler();
const getTransactionHandler = new GetTransactionHandler();


export const resolvers = {
    Query: {
        getTransaction: (parent: any, {id}: any) => {
            return getTransactionHandler.handler(id);
        },
    },
    Mutation: {
        createTransaction: (parent: any, args: any) => {
            return createTransactionHandler.handler(args.input);
        },
    },
};
