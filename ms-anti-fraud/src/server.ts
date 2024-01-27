import express, { Application, Router } from 'express';
import Logger from './infraestructure/logger/logger.config';

class Server {

    private app:Application;
    private port:string;
    private readonly logger=new Logger();
    constructor(){
        this.app=express();
        this.port=process.env.PORT||"3006";
    }
    init(){
        this.app.use(express.json());
    }
    listenServer(){
        this.listen();
    }
    mapRouter(prefix:string,router:Router){
        this.app.use(prefix,router);
    }
    private listen(){
        this.app.listen(this.port,()=>{
            this.logger.info('Server update');
        })
    }
}

export default Server;


