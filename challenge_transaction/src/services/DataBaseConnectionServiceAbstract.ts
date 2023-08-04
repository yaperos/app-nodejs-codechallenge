import {TypeormAdapter} from "../providers/TypeORM/TypeormAdapter";
import {EntityTarget, InsertResult, ObjectLiteral, UpdateResult} from "typeorm";
import {IModels, IModelsFind} from "../models/IModels";

export abstract class BaseConnectionService{
    protected typeormAdapter:TypeormAdapter;
    constructor(model: EntityTarget<ObjectLiteral>) {
        this.typeormAdapter = new TypeormAdapter(model);
    }

    abstract pagination(nameTable: string, orderColumn: string, skip?: number, take?: number): Promise<void | ObjectLiteral[]>;
    abstract bulkInser(bulkInsert:IModels[], fieldToUpdateForConflict:Array<string>):Promise<InsertResult | never[]>;
    abstract insert(insert:IModels[]):Promise<InsertResult | never[]>;
    abstract update(insert:IModels, parameterToFind:string, findObject:IModelsFind, typeDriver:boolean):Promise<UpdateResult | never[]>;
    abstract get(parameterToFind:string, findObject:IModelsFind, typeDriver:boolean):Promise<ObjectLiteral|{}|null>;
}