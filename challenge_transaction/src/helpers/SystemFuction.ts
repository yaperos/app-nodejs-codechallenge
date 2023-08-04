'use strict';

import * as fs from "fs";
import * as path from "path";
import ErrnoException = NodeJS.ErrnoException;
const validateRegexFile: RegExp = new RegExp(/(.js|.ts)+$/i);

function getEachEntity(): Promise<string[]>{
    let pathModels:string = __dirname + "/../models/";
    return new Promise((resolve, reject) => {
        fs.readdir(path.normalize(pathModels),(error:ErrnoException,files:string[]) => {
            if(error){
                reject(error);
            }
            resolve(files);
        })
    }).then((files:string[]) =>{
        return files.filter((file:string) => {
            if(validateRegexFile.test(file)){
                return file.slice(0,-3);
            }
        });
    })
    .then((files:string[]) =>{
        return files.map((value:string) => {
            return path.normalize(pathModels)+value.slice(0,-3)+"{.js,.ts}";
        });
    })
    .catch((error:ErrnoException) =>{
        console.error(error);
        return [];
    });
}

function getEachMigration(): Promise<string[]>{
    let pathMigration:string = __dirname + "/../migrations/";
    return new Promise((resolve, reject) => {
        fs.readdir(path.normalize(pathMigration),(error:ErrnoException,files:string[]) => {
            if(error){
                reject(error);
            }
            resolve(files);
        })
    }).then((files:string[]) =>{
        return files.filter((file:string) => {
            if(validateRegexFile.test(file)){
                return file.slice(0,-3);
            }
        });
    })
    .then((files:string[]) =>{
        return files.map((value:string) => {
            return path.normalize(pathMigration)+value.slice(0,-3)+"{.js,.ts}";
        });
    })
    .catch((error:ErrnoException) =>{
        console.error(error);
        return [];
    });
}

export {getEachEntity,getEachMigration}