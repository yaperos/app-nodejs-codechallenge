import { IJestStareConfig } from "./doc/IJestStareConfig";
import { Logger } from "../utils/Logger";
import { IProcessParms } from "./doc/IProcessParms";
export declare class Config {
    private mLogger;
    private mExplicitConfig;
    private mProcessParms;
    constructor(mLogger: Logger, mExplicitConfig: IJestStareConfig, mProcessParms: IProcessParms);
    buildConfig(): IJestStareConfig;
    private getJestStareConfig;
}
