import { Sequelize } from 'sequelize-typescript'
import Utils from '../../commons/utils/utils'
import path from 'path';

export default class DatabaseConfig{
    public sequelize:Sequelize;
    private uri:string;
    constructor(){
        this.uri = new Utils().buildURI();
        console.log(process.env.STAGE)
        console.log(this.uri)
        this.sequelize = new Sequelize(this.uri,{
          models:[path.join(__dirname,'..','models','db')]
        });
    }
    initialize = async()=>{
      
      if(process.env.STAGE == 'dev'){
        try{
        await this.sequelize.sync({alter:true});
        }catch(err){
          console.error(err)
        }
      }
    }

    testConnection = async():Promise<boolean>=>{
        try {
            await this.sequelize.authenticate();
            console.log('Connection has been established successfully.');
            return true;
          } catch (error) {
            console.error('Unable to connect to the database:', error);
            return false;
          }
    }
}