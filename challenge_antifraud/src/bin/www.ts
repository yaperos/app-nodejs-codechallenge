#!/usr/bin/env node

/**
 * Module dependencies.
 */
'use strict';

import * as logger from 'morgan';
import * as fs from "fs";
import * as http from "http";
import * as https from "https";
import * as path from "path";
import {app} from "../app";
import {SslConfig} from "../config/ssl";
import * as  util from "util";
import {spawn} from "child_process";

import {System} from "../config/system";
const systemObject = new System();

let ssl = new SslConfig();
let sslConfig  = ssl.getSslConfig();
let server : any;
let options: any;
let port = systemObject.normalizePort(process.env.PORT || '3000');

//configuration of morgan
// log only 4xx and 5xx responses to console
switch (process.env.NODE_ENV) {
    case 'production':
        app.use(logger('production', {
            skip: function (req, res) { return res.statusCode < 400 }
        }));

// log all requests to access.log
        app.use(logger('common', {
            stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
        }));
        break;
    default:
        app.use(logger('dev'));
        break;
}

/**
 * Get port from environment and store in Express.
 */

app.set('port', port);

/**
 * Create HTTP server.
 */

if (process.env.PORT !== "443") {
    console.info("Connecting on port " + process.env.PORT);
    server = http.createServer(app);
} else {
    console.info("Connecting on port " + process.env.PORT);
    let tempEncoding:any = { encoding: (process.env.SSL_UTF || 'utf8') };
    if (sslConfig.ca && sslConfig.ca !== '') {
        options = {
            key: fs.readFileSync(sslConfig.key, tempEncoding),
            cert: fs.readFileSync(sslConfig.cert, tempEncoding),
            ca: fs.readFileSync(sslConfig.ca, tempEncoding),
            dhparam: fs.readFileSync(sslConfig.dhparam, tempEncoding)
        },
            server = https.createServer(options, app);
    } else {
        options = {
            key: fs.readFileSync(sslConfig.key, tempEncoding),
            cert: fs.readFileSync(sslConfig.cert, tempEncoding),
            dhparam: fs.readFileSync(sslConfig.dhparam, tempEncoding)
        },
            server = https.createServer(options, app);
    }
}

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
new Promise(function (done, error) {
    try{
        if(server.on('error', systemObject.onError)){
            done(true);
        }else{
            error(false);
        }
    }catch (e) {
        error(e);
    }
}).then(function () {
    new Promise(function (done, error) {
        try{
            let server_address = systemObject.setAddress(server.address());
            if(server_address){
                done(server_address);
            }else{
                error(false);
            }
        }catch (e) {
            error(e);
        }
    }).then(function (server_Address) {
        server.on('listening', systemObject.onListening);
    }).catch(function (error) {
        if(!error){
            throw "A internal error occurred with the server address";
        }else{
            console.error(error);
            throw "A internal error occurred with the server address";
        }
    });
}).catch(function (error) {
    if(!error){
        throw "A internal error occurred with the manage of error of the server";
    }else{
        console.error(error);
        throw "A internal error occurred with the manage of error of the server";
    }
});

