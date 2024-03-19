import swaggerJSDoc from "swagger-jsdoc";
import {TransactionSchema} from "./schemas/transaction.schema";
import {TransferTypeSchema} from "./schemas/transferType.schema"

const swaggerDefinition = {
    openapi: "3.0.1",
    info: {
        title: "API REST Prueba Yape ",
        description: `REST API para poder testear los endpoints de las transacciones creadas`,
        version: "1.0.0"
    },
    servers: [
        {
            url: `http://localhost:${process.env.PORT || 3000}`
        }
    ],
    components: {
        schemas: {
            // TRANSACTION
            createTransaction: TransactionSchema.createTransaction,
            // TRANSFER TYPE
            getTransferTypeResponse: TransferTypeSchema.getTransferTypeResponse


        }
    }
}

const swaggerOptions = {
    swaggerDefinition,
    apis: ["./src/routes/*.ts"]
}

export const swaggerJS = swaggerJSDoc(swaggerOptions);