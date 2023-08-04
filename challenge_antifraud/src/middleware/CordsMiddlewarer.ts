'use strict';

import {NextFunction, Request, Response} from "express";

function setHeaders(req:Request, res:Response, next:NextFunction){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method, Access-Control-Allow-Headers, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header("Accept-Encoding" , "gzip,deflate");
    next();
}

export {
    setHeaders
}
