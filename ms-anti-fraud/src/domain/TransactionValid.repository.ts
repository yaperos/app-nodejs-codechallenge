import { Status } from "../helper/type.helper";


export interface TransactionValidRepository{
    validTransaction(value:number):Status;
}