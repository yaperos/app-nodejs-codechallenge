import { producer } from '../services/kafka.service'
import { KAFKA_TOPIC_TRANSACTION_UPDATED, TRANSACTION_STATUS } from '../utils/constants.utils'


function validateTransactionValue(value: number) {
    if (value > 1000) {
        return false
    }

    return true
}

export async function transactionCreatedController(uuid: string, value: number) {
    console.info('KAFKA_TOPIC_TRANSACTION_CREATED Message recieved', { uuid, value })

    const isValid = validateTransactionValue(value)

    const status = isValid ? TRANSACTION_STATUS.APPROVED : TRANSACTION_STATUS.REJECTED

    const payload = JSON.stringify({
        uuid,
        status
    })

    await producer.send({
        topic: KAFKA_TOPIC_TRANSACTION_UPDATED,
        messages: [
            {
                value: payload
            },
        ],
    })

    console.info('KAFKA_TOPIC_TRANSACTION_UPDATED Message sent', { payload })
}
