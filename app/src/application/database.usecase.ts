import { CacheDatabaseInterface } from "../domain/interfaces/cacheDatabase.interface";
import { TransactionType } from "../domain/types/transaction.interface";
import {createClient} from 'redis'
import { AntiFraudService } from './antifraud.usecase';


export class DatabaseService implements CacheDatabaseInterface {
    constructor(){}
    async getConnection(){
        const client = createClient({
          socket: {
            host: 'localhost',
            port: 6379,
          }
        })
        client.on('error', err => console.log('Redis Server Error', err));
        await client.connect();
        return client
      }
  
      getAntiFraudInstance(transaction:any){
        return new AntiFraudService().verify(transaction)
      }
  
    async process(transaction:TransactionType){
        transaction.transactionStatus={
            name : "pending"
        }
        transaction.createdAt = new Date()
        await (await this.getConnection()).set(String(transaction.tranferTypeId), JSON.stringify(transaction));    
        const antifraud = this.getAntiFraudInstance(transaction)
        transaction!.transactionStatus = {
            name: "approved"
        }
        if(!antifraud){
            transaction!.transactionStatus = {
                name: "rejected"
            }
        }
      await (await this.getConnection()).set(String(transaction.tranferTypeId), JSON.stringify(transaction));
      return transaction
    }
}