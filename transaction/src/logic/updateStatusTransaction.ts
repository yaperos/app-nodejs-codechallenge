import {ITransactionReceived, TransactionModel} from "../models/Transaction";

/**
 * Funcion para actualizar el estado de la transaccion dependiendo de la respuesta del microservicio AntiFraude
 * @param dataReceived 
 * @returns 
 */
export async function updateStatusTransaction(dataReceived: ITransactionReceived){

    try{
        console.log('dataReceived from antifraud', dataReceived)
        const statusTransaction = dataReceived.transactionStatus.name;

        const result = await TransactionModel.findByIdAndUpdate(
            dataReceived._id,
            {["transactionStatus"]: statusTransaction}
        )

        return result;

    } catch(err) {
        console.log('Error -> updateStatusTransaction: ', err)
    }
}