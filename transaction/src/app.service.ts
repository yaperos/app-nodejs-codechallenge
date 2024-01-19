import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { TransactionEntity } from './infrastructure/entities/transaction.entity';

let conn: EntityManager;
@Injectable()
export class AppService {
  private dataSource: DataSource;

  async onModuleInit(){

    try{
      const properties = {
        autoLoadEntities: true, 
        synchronize: true,
        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT),
        username: 'user',
        password: 'password123',
        database: 'transactions',
        logging: true
      }
      this.dataSource = await new DataSource({type: "mysql",  ...properties, entities: [TransactionEntity] }).initialize();
    }
    catch(e){
      console.log(`Error: ${e}`)
    }

    conn = this.dataSource.manager;
  }

  static get instConn(){
    return conn;
  }
}
