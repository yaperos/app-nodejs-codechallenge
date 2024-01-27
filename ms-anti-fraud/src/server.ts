import express, { Application, Router } from 'express';

class Server {

    private app:Application;
    private port:string;

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
            console.log(`server alive class ${this.port}`)
        })
    }
}

export default Server;


