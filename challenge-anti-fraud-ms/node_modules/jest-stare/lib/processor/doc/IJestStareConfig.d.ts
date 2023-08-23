export interface IJestStareConfig {
    resultDir?: string;
    resultJson?: string;
    resultHtml?: string;
    reportTitle?: string;
    reportHeadline?: string;
    reportSummary?: boolean;
    log?: boolean;
    jestStareConfigJson?: string;
    jestGlobalConfigJson?: string;
    coverageLink?: string;
    additionalResultsProcessors?: string[];
    report?: boolean;
    disableCharts?: boolean;
    hidePassing?: boolean;
    hideFailing?: boolean;
    hidePending?: boolean;
    hideTodo?: boolean;
}
export declare const PACKAGE_JSON_KEY = "jest-stare";
