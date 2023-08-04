'use strict';

import  express = require('express');
import * as path from 'path';
import {RoutesConfig} from './config/route';
import * as compression from 'compression';
import * as favicon from 'serve-favicon';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import * as CordsMiddleware from './middleware/CordsMiddlewarer';
import 'reflect-metadata';
import { Env } from './config/EnvConfiguration';
import { kafkaConsumerTransaction } from './controllers/TransactionController';

let app = express();
new Promise(function (done, error) {
    let envLoaded:any = new Env();
    done(envLoaded.getEnv);
}).then(async function (validate) {
    if(validate){
        try{
            app.use((req:any, res:any, next:any) => {
                kafkaConsumerTransaction();
                next();
            });
            app.use(helmet());
            app.use(compression());
            app.use(CordsMiddleware.setHeaders);
            // view engine setup
            app.set('views', path.join(__dirname, 'views'));
            app.set('view engine', 'ejs');
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: false }));
            app.use(express.json());
            app.use(express.urlencoded({ extended: false }));
            app.use(express.static(path.join(__dirname, 'public')));
            let Routes = new RoutesConfig(),
                routes = Routes.getRoutes();

            for (let i = 0; i < routes.length; i++) {
                app.use(routes[i].path, routes[i].route_parameter.router);
            }

            // catch 404 and forward to error handler
            app.use(function( err:any, req:any, res:any, next:any) {
                console.error("Error 404 on the main deploy");
                res.status(err.status || 404);
                res.render('error', {
                    message: err.message,
                    error: {}
                });
            });

            // error handler
            app.use(function(err:any, req:any, res:any, next:any) {
                // set locals, only providing error in development
                console.error("Error 500 on the main deploy");
                res.locals.message = err.message;
                res.locals.error = req.app.get('env') === 'development' ? err : {};

                // render the error page
                res.status(err.status || 500);
                res.render('error');
            });
        }catch (e) {
            console.error("An error ocurred on app.ts config:", e);
            throw "An error ocurred on app.ts config";
        }
    }else{
        console.error("We required a .env deployed on the platform", validate);
        throw "We required a .env deployed on the platform";
    }
});

export {app};