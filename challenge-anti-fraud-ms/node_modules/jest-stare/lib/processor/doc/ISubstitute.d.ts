import { IJestStareConfig } from "./IJestStareConfig";
import { AggregatedResult } from "@jest/test-result";
export interface ISubstitute {
    results?: AggregatedResult;
    rawResults?: string;
    jestStareConfig?: IJestStareConfig;
    rawJestStareConfig?: string;
    globalConfig?: string;
}
