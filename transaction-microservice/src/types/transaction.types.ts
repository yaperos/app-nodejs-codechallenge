import { t } from 'elysia'


export const getTransactionQuerySchema = t.Object({
    uuid: t.String()
})

export const getTransactionResponseSchema = t.Object({
    transactionExternalId: t.String(),
    transactionType: t.Object({
        name: t.String()
    }),
    transactionStatus: t.Object({
        name: t.String()
    }),
    value: t.Number(),
    createdAt: t.String(),
})

export type getTransactionResponseSchemaType = (typeof getTransactionResponseSchema)['static']

export const createTransactionBodySchema = t.Object({
    accountExternalIdDebit: t.String(),
    accountExternalIdCredit: t.String(),
    tranferTypeId: t.Number(),
    value: t.Number()
})

export type createTransactionBodySchemaType = (typeof createTransactionBodySchema)['static']

export const createTransactionResponseSchema = t.Object({
    uuid: t.String()
})

export type createTransactionResponseSchemaType = (typeof createTransactionResponseSchema)['static']

export type transactionUpdatedPayload = {
    uuid?: string
    status?: string
}
