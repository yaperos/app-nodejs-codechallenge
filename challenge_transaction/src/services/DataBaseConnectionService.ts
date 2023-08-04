'use strict';

import {ObjectLiteral} from "typeorm";
import {IModels, IModelsFind} from "../models/IModels";
import { BaseConnectionService } from './DataBaseConnectionServiceAbstract';

export class DataBaseConnectionService extends BaseConnectionService{
    async pagination(nameTable: string, orderColumn: string, skip?: number, take?: number): Promise<void | ObjectLiteral[]> {
        return await this.typeormAdapter.pagination(nameTable, orderColumn,skip,take);
    }

    async bulkInser(bulkInsert:IModels[], fieldToUpdateForConflict:Array<string>){
        return await this.typeormAdapter.insertBulkOrUpdate(bulkInsert, fieldToUpdateForConflict);
    }

    async insert(insert:IModels[]){
        return await this.typeormAdapter.insert(insert);
    }

    async update(insert:IModels, parameterToFind:string, findObject:IModelsFind, typeDriver:boolean = true){
        return await this.typeormAdapter.update(insert, parameterToFind, findObject, typeDriver);
    }

    async get(parameterToFind:string, findObject:IModelsFind, typeDriver:boolean = true){
        return await this.typeormAdapter.get(parameterToFind, findObject, typeDriver);
    }

}