import { IJestStareConfig } from "./doc/IJestStareConfig";
import { Logger } from "../utils/Logger";
import { IProcessParms } from "./doc/IProcessParms";
import { AggregatedResult } from "@jest/test-result";
export declare class Processor {
    private mResults;
    private mExplicitConfig?;
    private mProcessParms?;
    static run(results: AggregatedResult, explicitConfig?: IJestStareConfig, parms?: IProcessParms): AggregatedResult;
    private mLog;
    constructor(mResults: AggregatedResult, mExplicitConfig?: IJestStareConfig, mProcessParms?: IProcessParms);
    private generate;
    private collectImageSnapshots;
    private generateReport;
    private execute;
    private addThirdParty;
    private obtainWebFile;
    private obtainJsRenderFile;
    set logger(logger: Logger);
    get logger(): Logger;
}
