import { OnModuleInit } from "@nestjs/common";

export class TransactionProperties implements OnModuleInit{
    onModuleInit() {
        
    } 
    
    transactionStatus = new Map<string, string>();



}