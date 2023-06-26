import { registerEnumType } from "@nestjs/graphql";

export enum TransactionType {
    instant = 'instant', 
    ordinary = 'ordinary',  
    urgent = 'urgent'
}

registerEnumType( TransactionType, 
    { 
        name: 'TransactionType', 
        description: 'Según plazo: ordinaria, inmediata o urgente' 
    } )