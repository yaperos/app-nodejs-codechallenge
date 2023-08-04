'use strict';

import * as dotenv from 'dotenv';
import * as fs from "fs";

class Env {
    protected pathConfig:any;
    protected envSetting:any;
    constructor() {
        if (fs.existsSync(".env") || fs.existsSync(".env.test") || fs.existsSync(".env.production")) {
            switch (process.env.NODE_ENV) {
                case "test":
                    this.pathConfig = `${__dirname}/../../.env.test`;
                    break;
                case "production":
                    this.pathConfig = `${__dirname}/../../.env.production`;
                    break;
                default:
                    this.pathConfig = `${__dirname}/../../.env`;
            }
            this.envSetting = dotenv.config({ path: this.pathConfig })
        }else{
            this.pathConfig = null;
            console.error("We required a .env deployed on the platform");
            throw "We required a .env deployed on the platform";
        }
    }

    public get getEnv():object{
        return this.envSetting;
    }
}

function ObjectEnvConfig(Class:any) {
    return (...args:any[]) => {
        return new Env();
    }
}

export { Env, ObjectEnvConfig }