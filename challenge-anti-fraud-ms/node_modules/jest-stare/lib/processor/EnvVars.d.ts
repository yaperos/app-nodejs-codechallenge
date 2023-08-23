import { IJestStareConfig } from "./doc/IJestStareConfig";
import { EnvVarService } from "../utils/EnvVarService";
export declare class EnvVars {
    private mEnvSrv;
    static readonly ENV_PREFIX: string;
    constructor(mEnvSrv?: EnvVarService);
    read(): IJestStareConfig;
    resolve(packageJsonConfig: IJestStareConfig, envConfig: IJestStareConfig): IJestStareConfig;
}
