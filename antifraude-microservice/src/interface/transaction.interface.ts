import { Document } from 'mongoose';

export interface ITransaction extends Document{
    
    readonly externalId: string;
  
    readonly tranferTypeId: number;
    
    readonly accountExternalIdDebit: number;
    
    readonly accountExternalIdCredit: string;
    
    readonly value: number;
    
    readonly status: number;
    
    readonly createdAt: number;
}