import {Method} from "./TRequestAdapter";

export interface IRequestAdapter{
    request(method: Method):void
}

export interface IRequestOptions{
    hostname:string;
    port?:string;
    path?:string;
    method:string;
    headers?:object;
}