import { Document } from 'mongoose';

export interface ITransaction extends Document{
    
    readonly externalId: string;
  
    readonly transferTypeId: number;
    
    readonly accountExternalIdDebit: number;
    
    readonly accountExternalIdCredit: string;
    
    readonly value: number;
    
    readonly status: string;
    
    readonly createdAt: number;
}