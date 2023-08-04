'use strict';

import {DataSource, EntityTarget, ObjectLiteral} from "typeorm";
import {AppDataSource} from "../../data-source";
import {ITypeORMAdapter} from "./ITypeORMAdapter";
import {IModels, IModelsFind} from "../../models/IModels";

class TypeormAdapter implements ITypeORMAdapter{
    protected _model:EntityTarget<ObjectLiteral>;
    constructor(model:EntityTarget<ObjectLiteral>) {
        this._model = model;
    }

    async pagination(nameTable:string,orderColumn:string, skip:number=0, take:number=10){
            return await AppDataSource.then(async (dataSource:DataSource) =>{
                return await dataSource
                    .getRepository(this.model)
                    .createQueryBuilder(nameTable)
                    .orderBy(nameTable+'.'+orderColumn, "DESC")
                    .take(take)
                    .skip(skip)
                    .getMany();
            }).catch((error) => {
                console.error(error);
                return [];
            });
    }

    async insertBulkOrUpdate(bulkInsert:IModels[], fieldToUpdateForConflict:Array<string>){
        return await AppDataSource.then(async (dataSource:DataSource) =>{
            return await dataSource
                .getRepository(this.model)
                .createQueryBuilder()
                .insert()
                .into(this.model)
                .values(bulkInsert)
                .orUpdate(fieldToUpdateForConflict)
                .orIgnore()
                .execute();
        }).catch((error) => {
            console.error(error);
            return [];
        });
    }

    async insert(insert:IModels[]){
        return await AppDataSource.then(async (dataSource:DataSource) =>{
            return await dataSource
                .getRepository(this.model)
                .createQueryBuilder()
                .insert()
                .into(this.model)
                .values(insert)
                .execute();
        }).catch((error) => {
            console.error(error);
            return [];
        });
    }

    async update(insert:IModels, parameterToFind:string, findObject:IModelsFind){
        return await AppDataSource.then(async (dataSource:DataSource) =>{
            return await dataSource
                .getRepository(this.model)
                .createQueryBuilder()
                .update()
                .set(insert)
                .where(parameterToFind+" = :"+parameterToFind,findObject)
                .execute();
        }).catch((error) => {
            console.error(error);
            return [];
        });
    }

    async get(parameterToFind:string, findObject:IModelsFind, typeDriver:boolean = true){
        if(typeDriver){
            return await AppDataSource.then(async (dataSource:DataSource) =>{
                return await dataSource
                    .getRepository(this.model)
                    .createQueryBuilder()
                    .where(parameterToFind+" = :"+parameterToFind,findObject)
                    .getOne();
            }).catch((error) => {
                console.error(error);
                return {};
            });
        }else{
            return await AppDataSource.then(async (dataSource:DataSource) =>{
                return await dataSource
                    .getRepository(this.model)
                    .findOneBy(findObject);
            }).catch((error) => {
                console.error(error);
                return {};
            });
        }
    }
    get model(){
        return this._model;
    }
}

export { TypeormAdapter }