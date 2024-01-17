import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

let conn: EntityManager;
@Injectable()
export class AppService {
  private dataSource: DataSource;

  async onModuleInit(){

    try{
      this.dataSource = await new DataSource({
        type: 'mysql',
        synchronize: true,
        host: process.env.MYSQL_HOST,
        port: Number(process.env.MYSQL_PORT),
        username: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
      }).initialize();
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
