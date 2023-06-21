import "reflect-metadata"
import express from 'express'
import AppRoutes, { initialize } from './infrastructure/presentation';
import env from './infrastructure/config/env/env'
import Db from './infrastructure/config/db/typeorm'
import Logger from "./infrastructure/config/logger/winston"
import { urlNotFound } from "./libs/response"
import cors from "cors"

const start = async () => {
    const app = express();

    //Initializing pool connection typeorm
    Db.initialize().then(() => {
        Logger.info(`Database connected`);
    }).catch((err) => {
        Logger.error(`Database failed => ${err}`);
    })

    //Adding middleware
    app.use(cors())
    app.use(express.json());

    //Initializing presentation layer
    initialize();
    AppRoutes.forEach((value) => {
        app.use(value);
    });
    
    //Adding middleware when url is not present    
    app.use(urlNotFound());

    //Initializing server
    app.listen(env.App.Port,() => {
        Logger.info(`Server running on port ${env.App.Port}`);
    });
};

start();