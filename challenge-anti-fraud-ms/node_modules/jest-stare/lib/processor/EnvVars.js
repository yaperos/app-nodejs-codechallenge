"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvVars = void 0;
const Logger_1 = require("../utils/Logger");
const EnvVarService_1 = require("../utils/EnvVarService");
class EnvVars {
    constructor(mEnvSrv = new EnvVarService_1.EnvVarService(EnvVars.ENV_PREFIX)) {
        this.mEnvSrv = mEnvSrv;
    }
    read() {
        const additionalResultsProcessorsValue = this.mEnvSrv.readEnvValue("ADDITIONAL_RESULTS_PROCESSORS");
        let additionalResultsProcessors;
        if (additionalResultsProcessorsValue != null) {
            try {
                additionalResultsProcessors = JSON.parse(additionalResultsProcessorsValue);
            }
            catch (e) {
                Logger_1.Logger.get.error("Could not parse additional results processors value." +
                    "It should be a JSON string of an array of strings, like the following: " +
                    JSON.stringify(["jest-junit"]) + "\n You specified: " + additionalResultsProcessorsValue);
            }
        }
        return {
            resultDir: this.mEnvSrv.readEnvValue("RESULT_DIR"),
            resultJson: this.mEnvSrv.readEnvValue("RESULT_JSON"),
            resultHtml: this.mEnvSrv.readEnvValue("RESULT_HTML"),
            log: this.mEnvSrv.readBoolEnvValue("LOG"),
            jestStareConfigJson: this.mEnvSrv.readEnvValue("CONFIG_JSON"),
            jestGlobalConfigJson: this.mEnvSrv.readEnvValue("GLOBAL_CONFIG_JSON"),
            coverageLink: this.mEnvSrv.readEnvValue("COVERAGE_LINK"),
            report: this.mEnvSrv.readBoolEnvValue("REPORT"),
            reportTitle: this.mEnvSrv.readEnvValue("REPORT_TITLE"),
            reportHeadline: this.mEnvSrv.readEnvValue("REPORT_HEADLINE"),
            reportSummary: this.mEnvSrv.readBoolEnvValue("REPORT_SUMMARY"),
            additionalResultsProcessors,
            disableCharts: this.mEnvSrv.readBoolEnvValue("DISABLE_CHARTS"),
            hidePassing: this.mEnvSrv.readBoolEnvValue("HIDE_PASSING"),
            hideFailing: this.mEnvSrv.readBoolEnvValue("HIDE_FAILING"),
            hidePending: this.mEnvSrv.readBoolEnvValue("HIDE_PENDING")
        };
    }
    resolve(packageJsonConfig, envConfig) {
        const mergedConfig = {};
        if (envConfig.resultDir != null || packageJsonConfig.resultDir != null) {
            mergedConfig.resultDir = envConfig.resultDir == null ? packageJsonConfig.resultDir : envConfig.resultDir;
        }
        if (envConfig.resultJson != null || packageJsonConfig.resultJson != null) {
            mergedConfig.resultJson = envConfig.resultJson == null ? packageJsonConfig.resultJson : envConfig.resultJson;
        }
        if (envConfig.resultHtml != null || packageJsonConfig.resultHtml != null) {
            mergedConfig.resultHtml = envConfig.resultHtml == null ? packageJsonConfig.resultHtml : envConfig.resultHtml;
        }
        if (envConfig.log != null || packageJsonConfig.log != null) {
            mergedConfig.log = envConfig.log == null ? packageJsonConfig.log : envConfig.log;
        }
        if (envConfig.report != null || packageJsonConfig.report != null) {
            mergedConfig.report = envConfig.report == null ? packageJsonConfig.report : envConfig.report;
        }
        if (envConfig.reportTitle != null || packageJsonConfig.reportTitle != null) {
            mergedConfig.reportTitle = envConfig.reportTitle == null ? packageJsonConfig.reportTitle : envConfig.reportTitle;
        }
        if (envConfig.reportHeadline != null || packageJsonConfig.reportHeadline != null) {
            mergedConfig.reportHeadline = envConfig.reportHeadline == null ? packageJsonConfig.reportHeadline : envConfig.reportHeadline;
        }
        if (envConfig.reportSummary != null || packageJsonConfig.reportSummary != null) {
            mergedConfig.reportSummary = envConfig.reportSummary == null ? packageJsonConfig.reportSummary : envConfig.reportSummary;
        }
        if (envConfig.jestStareConfigJson != null || packageJsonConfig.jestStareConfigJson != null) {
            mergedConfig.jestStareConfigJson =
                envConfig.jestStareConfigJson == null ? packageJsonConfig.jestStareConfigJson : envConfig.jestStareConfigJson;
        }
        if (envConfig.jestGlobalConfigJson != null || packageJsonConfig.jestGlobalConfigJson != null) {
            mergedConfig.jestGlobalConfigJson =
                envConfig.jestGlobalConfigJson == null ? packageJsonConfig.jestGlobalConfigJson : envConfig.jestGlobalConfigJson;
        }
        if (envConfig.coverageLink != null || packageJsonConfig.coverageLink != null) {
            mergedConfig.coverageLink = envConfig.coverageLink == null ? packageJsonConfig.coverageLink : envConfig.coverageLink;
        }
        if (envConfig.additionalResultsProcessors != null || packageJsonConfig.additionalResultsProcessors != null) {
            mergedConfig.additionalResultsProcessors =
                envConfig.additionalResultsProcessors == null ? packageJsonConfig.additionalResultsProcessors : envConfig.additionalResultsProcessors;
        }
        if (envConfig.disableCharts != null || packageJsonConfig.disableCharts != null) {
            mergedConfig.disableCharts =
                envConfig.disableCharts == null ? packageJsonConfig.disableCharts : envConfig.disableCharts;
        }
        if (envConfig.hidePassing != null || packageJsonConfig.hidePassing != null) {
            mergedConfig.hidePassing =
                envConfig.hidePassing == null ? packageJsonConfig.hidePassing : envConfig.hidePassing;
        }
        if (envConfig.hideFailing != null || packageJsonConfig.hideFailing != null) {
            mergedConfig.hideFailing =
                envConfig.hideFailing == null ? packageJsonConfig.hideFailing : envConfig.hideFailing;
        }
        if (envConfig.hidePending != null || packageJsonConfig.hidePending != null) {
            mergedConfig.hidePending =
                envConfig.hidePending == null ? packageJsonConfig.hidePending : envConfig.hidePending;
        }
        return mergedConfig;
    }
}
exports.EnvVars = EnvVars;
EnvVars.ENV_PREFIX = "JEST_STARE_";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW52VmFycy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wcm9jZXNzb3IvRW52VmFycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFDQSw0Q0FBeUM7QUFDekMsMERBQXVEO0FBT3ZELE1BQWEsT0FBTztJQWNoQixZQUFvQixVQUFVLElBQUksNkJBQWEsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1FBQS9DLFlBQU8sR0FBUCxPQUFPLENBQXdDO0lBQUksQ0FBQztJQU9qRSxJQUFJO1FBQ1AsTUFBTSxnQ0FBZ0MsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQ3BHLElBQUksMkJBQXFDLENBQUM7UUFDMUMsSUFBSSxnQ0FBZ0MsSUFBSSxJQUFJLEVBQUU7WUFDMUMsSUFBSTtnQkFDQSwyQkFBMkIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7YUFDOUU7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDUixlQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxzREFBc0Q7b0JBQ25FLHlFQUF5RTtvQkFDekUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLEdBQUcsb0JBQW9CLEdBQUcsZ0NBQWdDLENBQUMsQ0FBQzthQUNqRztTQUNKO1FBQ0QsT0FBTztZQUNILFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksQ0FBQyxZQUFZLENBQUM7WUFDbEQsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQztZQUNwRCxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDO1lBQ3BELEdBQUcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQztZQUN6QyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFD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