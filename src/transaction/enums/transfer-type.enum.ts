import { registerEnumType } from "@nestjs/graphql";

export enum TranferType {
    instant = 1, 
    ordinary = 2,  
    urgent = 3
}

registerEnumType( TranferType, 
    { 
        name: 'TranferType', 
        description: 'Según plazo: ordinaria, inmediata o urgente' 
    } )