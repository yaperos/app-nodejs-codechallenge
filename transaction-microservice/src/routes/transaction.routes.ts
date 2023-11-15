import { Elysia } from 'elysia'

import { retrieveTransaction, createTransaction } from '../controllers/transaction.controller'
import { createTransactionBodySchema, createTransactionResponseSchema, getTransactionQuerySchema, getTransactionResponseSchema } from '../types/transaction.types'


export const router = () => new Elysia()
        .get(
            '/api/transaction',
            ({ query: { uuid } }) => {
                return retrieveTransaction(uuid)
            },
            {
                query: getTransactionQuerySchema,
                response: getTransactionResponseSchema
            }
        )
        .post(
            '/api/transaction',
            ({ body: transactionDetails }) => {
                return createTransaction(transactionDetails)
            },
            {
                body: createTransactionBodySchema,
                response: createTransactionResponseSchema
            }
        )
