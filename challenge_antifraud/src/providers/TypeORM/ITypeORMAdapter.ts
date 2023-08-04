import {EntityTarget, InsertResult, UpdateResult, ObjectLiteral} from "typeorm";
import {IModels, IModelsFind} from "../../models/IModels";
import { TModels } from '../../models/TModels'

export interface ITypeORMAdapter{
    pagination: (nameTable: string, orderColumn: string, skip?: number, take?: number) => Promise<ObjectLiteral[] | never[]>,
    insertBulkOrUpdate: (bulkInsert:IModels[], fieldToUpdateForConflict:Array<string>) => Promise<InsertResult| never[]>,
    insert: (insert:IModels[]) => Promise<InsertResult | never[]>,
    update: (insert:IModels, parameterToFind:string, findObject:IModelsFind) => Promise<UpdateResult | never[]>,
    get: (parameterToFind:string, findObject:IModelsFind, typeDriver:boolean) => Promise<TModels |ObjectLiteral | {} | null>,
    model: EntityTarget<ObjectLiteral>
}