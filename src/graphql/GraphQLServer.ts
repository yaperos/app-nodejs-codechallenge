import { Express } from "express";
import { GraphQLSchema, buildSchema } from "graphql";
import { createHandler } from "graphql-http/lib/use/express";
import { ITransactionHandler } from "../handler";
import {
  ICreateTransactionArguments,
  IGetTransactionByIdArguments,
  ISchemaResolvers,
} from "./GraphQLServer.interface";

type dependencies = {
  transactionHandler: ITransactionHandler;
};

export class GraphQLServer {
  private _schema: GraphQLSchema;
  private _rootValue: ISchemaResolvers;
  private _transactionHandler: ITransactionHandler;

  private static _server: GraphQLServer;

  public set transactionHandler(transactionHandler: ITransactionHandler) {
    this._transactionHandler = transactionHandler;
  }

  public static instance({ transactionHandler }: dependencies): GraphQLServer {
    if (GraphQLServer._server) {
      return GraphQLServer._server;
    }

    GraphQLServer._server = new GraphQLServer();
    GraphQLServer._server.transactionHandler = transactionHandler;
    GraphQLServer._server._initialize();
    return GraphQLServer._server;
  }

  private _initialize() {
    this._schema = this.getSchema();

    this._rootValue = this.getRootValue();
  }

  private getSchema(): GraphQLSchema {
    return buildSchema(`
      type TransactionType {
        name: String!
      }

      type TransactionStatus {
        name: String!
      }

      type Transaction {
        transactionExternalId: String!
        transactionType: TransactionType!
        transactionStatus: TransactionStatus!
        value: Float!
        createdAt: String!
      }

      type Query {
        transaction(id: ID!): Transaction
      }


      input CreateTransactionInput {
        accountExternalIdDebit: String!
        accountExternalIdCredit: String!
        transferTypeId: Int!
        value: Float!
      }

      type CreateTransactionResponse {
        id: ID!
      }

      type Mutation {
        createTransaction(transactionData: CreateTransactionInput!) :CreateTransactionResponse!
      }      
    `);
  }

  private getRootValue(): ISchemaResolvers {
    return {
      transaction: ({ id }: IGetTransactionByIdArguments) => {
        return this._transactionHandler.getTransactionById(id);
      },
      createTransaction: ({ transactionData }: ICreateTransactionArguments) => {
        return this._transactionHandler.createTransaction(transactionData);
      },
    };
  }

  setup(server: Express) {
    server.all(
      "/graphql",
      createHandler({ schema: this._schema, rootValue: this._rootValue })
    );
  }
}
