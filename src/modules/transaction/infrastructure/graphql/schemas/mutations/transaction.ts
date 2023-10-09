import { GraphQLString, GraphQLInt } from "graphql";
import { transactionUsecase } from "../../../dependencies";
import { CreateTransactionRequestDto } from "../../../../domain/interfaces/dtos/transaction-request.dto";

export const CREATE_TRANSACTION = {
    type: GraphQLString,
    args: {
        accountExternalIdDebit: { type: GraphQLString, require: true },
        accountExternalIdCredit: { type: GraphQLString },
        transferTypeId: { type: GraphQLInt },
        value: { type: GraphQLInt },
    },
    async resolve(_: any, args: any) {
        await transactionUsecase.createTransaction(args as CreateTransactionRequestDto);
        
        return "Transaction created successfully";
    }
}