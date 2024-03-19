import { ITransactionReceived, ITransactionSend } from "../models/Transactions"
import {StatusTransaction} from "../models/StatusTransactions";
import {produce} from "../kafka/producer"

/**
 * Funcion donde se validará que el monto de la transacción cumpla lo deseado
 * @param messageData 
 *  
 */
export const validateAntifraud = async (messageData:ITransactionReceived) => {

    try {
        console.log('dataReceived from Transaction Microservice', messageData)
        messageData.transactionStatus = validateAmount(messageData.value)

        let dataSend: ITransactionSend = {
            _id: messageData._id,
            createdAt: messageData.createdAt,
            transactionExternalId: messageData.transferTypeId.name === 'Credit' ? messageData.accountExternalIdCredit: messageData.accountExternalIdDebit,
            transactionType: {
                name: messageData.transferTypeId.name
            },
            transactionStatus: {
                name: messageData.transactionStatus
            },
            value: messageData.value
        };

        console.log('dataSend', dataSend)

        const dataSendStringify = JSON.stringify(dataSend)

        produce(dataSendStringify).catch(err => {
            console.log('Error -> validateAntiFraud -> produce: ', err)
        })
    } catch(err) {
        console.log('Error -> validateAntifraud -> ', err);
    }
    


}

/**
 * Funcion para validar la cantidad del monto maximo permitida
 * @param amount 
 * @returns StatusTransaction
 */
function validateAmount(amount: number): StatusTransaction{
    const AMOUNT_MAX_ALLOWED = 1000;
    if(amount > AMOUNT_MAX_ALLOWED){
        return StatusTransaction.rejected
    } else {
        return StatusTransaction.approved
    }

}