import {uuid} from "short-uuid"


export const TransactionSchema = {
    createTransaction: {
        type: "object",
        required: ["accountExternalIdDebit", "accountExternalIdCredit", "transferTypeId", "value"],
        properties: {
            accountExternalIdDebit: {
                type: "string",  
                default: uuid()              
            },
            accountExternalIdCredit: {
                type: "string",    
                default: uuid()            
            },
            transferTypeId: {
                type: "string",                
            },
            value: {
                type: "number",                
            },
        }
    }
}
