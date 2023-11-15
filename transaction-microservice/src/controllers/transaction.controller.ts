import { TransactionStatus } from '@prisma/client'
import { randomUUID } from 'crypto'

import { prisma } from '../services/prisma.service'
import { producer } from '../services/kafka.service'
import { BadRequestError } from '../utils/errors.utils'
import { KAFKA_TOPIC_TRANSACTION_CREATED } from '../utils/constants.utils'
import { createTransactionBodySchemaType, createTransactionResponseSchemaType, getTransactionResponseSchemaType } from '../types/transaction.types'


export async function retrieveTransaction(uuid: string): Promise<getTransactionResponseSchemaType> {
    const transaction = await prisma.transaction.findUnique({
        where: {
            uuid
        },
        include: {
            transactionType: true
        }
    })

    if (!transaction) {
        throw new BadRequestError('Transaction not found')
    }

    return {
        transactionExternalId: transaction.uuid,
        transactionType: {
            name: transaction.transactionType.name
        },
        transactionStatus: {
            name: transaction.status
        },
        value: transaction.value.toNumber(),
        createdAt: transaction.createdAt.toISOString()
    }
}

export async function createTransaction(transactionDetails: createTransactionBodySchemaType): Promise<createTransactionResponseSchemaType> {
    const uuid = randomUUID()

    const transactionType = await prisma.transactionType.findUnique({
        where: {
            id: transactionDetails.tranferTypeId
        }
    })

    if (!transactionType) {
        throw new BadRequestError('Invalid transaction type')
    }
    
    const transaction = await prisma.transaction.create({
        data: {
            uuid,
            accountExternalIdDebit: transactionDetails.accountExternalIdDebit,
            accountExternalIdCredit: transactionDetails.accountExternalIdCredit,
            transactionTypeId: transactionType.id,
            status: TransactionStatus.pending,
            value: transactionDetails.value
        }
    })

    await producer.send({
        topic: KAFKA_TOPIC_TRANSACTION_CREATED,
        messages: [
            {
            value: JSON.stringify({
                uuid: transaction.uuid,
                value: transaction.value.toNumber()
            }),
            },
        ],
    })

    return {
        uuid: transaction.uuid
    }
}

export async function updateTransactionStatus(uuid: string, status: TransactionStatus) {
    console.info('KAFKA_TOPIC_TRANSACTION_UPDATED Message recieved', { uuid, status })

    await prisma.transaction.update({
        where: {
            uuid
        },
        data: {
            status
        }
    })

    console.info('KAFKA_TOPIC_TRANSACTION_UPDATED Stored new transaction status', { uuid, status })
}
