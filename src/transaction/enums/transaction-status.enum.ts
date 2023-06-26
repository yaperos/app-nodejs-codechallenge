import { registerEnumType } from "@nestjs/graphql";

export enum TransactionStatus {
    pending = 'pending', 
    approved = 'approved',  
    rejected = 'rejected'
}

registerEnumType( TransactionStatus, 
    { 
        name: 'TransactionStatus', 
        description: 'Estado de la transacción' 
    } )