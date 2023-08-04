'use strict';

import * as https from "https";
import {IncomingMessage, RequestOptions, OutgoingHttpHeaders, ClientRequest} from "http";
import {Method} from "./TRequestAdapter";
import {IRequestAdapter, IRequestOptions} from "./IRequestAdapter";

class RequestAdapter implements IRequestAdapter{
    protected _https = https;
    protected hostname:string;
    protected path:string;
    protected port?:number;
    protected headers?:object;
    protected method: Method;

    constructor(hostname:string, path:string, port?:number, headers?:object) {
        this.hostname= hostname;
        this.path = path;
        this.port = port;
        this.headers = headers?headers:{'Content-Type': 'application/json;charset=utf-8'};
    }

    request(method: Method){
        this.method = method;
        return this._https.request({
            hostname: this.hostname,
            port:this.port,
            path:this.path,
            method:this.method,
            headers:<OutgoingHttpHeaders>this.headers}, (response: IncomingMessage) => {
            let data = '';
            response.on('data', (chunk) => {
                console.log("entro en chunk");
                data = data + chunk.toString();
            })

            response.on('close', () => {
                console.log('Retrieved all data');
                console.log(JSON.parse(data));
            });

            response.on('end', () => {
                console.log("data: ",data);
                return JSON.parse(data);
            });
        }).on('error', (error) => {
            console.log(error);
            return error;
        }).end();
    }
}

export { RequestAdapter }