"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const util_1 = require("util");
const Constants_1 = require("./Constants");
const IJestStareConfig_1 = require("./doc/IJestStareConfig");
const EnvVars_1 = require("./EnvVars");
const IO_1 = require("../utils/IO");
class Config {
    constructor(mLogger, mExplicitConfig, mProcessParms) {
        this.mLogger = mLogger;
        this.mExplicitConfig = mExplicitConfig;
        this.mProcessParms = mProcessParms;
    }
    buildConfig() {
        const packageJsonConfig = this.getJestStareConfig();
        const envVars = new EnvVars_1.EnvVars();
        const mergedEnvAndPackageJsonConfig = envVars.resolve(packageJsonConfig, envVars.read());
        const config = this.mExplicitConfig || mergedEnvAndPackageJsonConfig;
        if (this.mExplicitConfig != null) {
            Object.keys(mergedEnvAndPackageJsonConfig).forEach((key) => {
                if ((0, util_1.isNullOrUndefined)(this.mExplicitConfig[key]) && !(0, util_1.isNullOrUndefined)(mergedEnvAndPackageJsonConfig[key])) {
                    config[key] = mergedEnvAndPackageJsonConfig[key];
                }
            });
        }
        if (config.resultDir == null) {
            config.resultDir = Constants_1.Constants.DEFAULT_RESULTS_DIR;
        }
        if (config.resultDir[config.resultDir.length - 1] !== "/") {
            config.resultDir += "/";
        }
        if (!(0, util_1.isNullOrUndefined)(config.log)) {
            this.mLogger.on = config.log;
        }
        if (!(0, util_1.isNullOrUndefined)(this.mExplicitConfig)) {
            if (this.mProcessParms && this.mProcessParms.reporter) {
            }
            else {
                this.mLogger.info(Constants_1.Constants.OVERRIDE_JEST_STARE_CONFIG);
            }
        }
        if ((0, util_1.isNullOrUndefined)(config.resultHtml)) {
            this.mLogger.debug("Setting to default resultHtml");
            config.resultHtml = Constants_1.Constants.MAIN_HTML;
        }
        else {
            if (config.resultHtml.indexOf(Constants_1.Constants.HTML_EXTENSION) === -1) {
                config.resultHtml = config.resultHtml + Constants_1.Constants.HTML_EXTENSION;
            }
        }
        if ((0, util_1.isNullOrUndefined)(config.resultJson)) {
            config.resultJson = Constants_1.Constants.RESULTS_RAW;
        }
        return config;
    }
    getJestStareConfig() {
        const packageJsonObject = IO_1.IO.readPackageJson();
        if (packageJsonObject[IJestStareConfig_1.PACKAGE_JSON_KEY] == null) {
            return {};
        }
        else {
            return packageJsonObject[IJestStareConfig_1.PACKAGE_JSON_KEY];
        }
    }
}
exports.Config = Config;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Byb2Nlc3Nvci9Db25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0JBQXlDO0FBQ3pDLDJDQUF3QztBQUN4Qyw2REFBNEU7QUFDNUUsdUNBQW9DO0FBR3BDLG9DQUFpQztBQU9qQyxNQUFhLE1BQU07SUFPZixZQUFvQixPQUFlLEVBQVUsZUFBaUMsRUFBVSxhQUE0QjtRQUFoRyxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVUsb0JBQWUsR0FBZixlQUFlLENBQWtCO1FBQVUsa0JBQWEsR0FBYixhQUFhLENBQWU7SUFBSSxDQUFDO0lBT2xILFdBQVc7UUFHZCxNQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1FBR3BELE1BQU0sT0FBTyxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1FBQzlCLE1BQU0sNkJBQTZCLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUd6RixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsZUFBZSxJQUFJLDZCQUE2QixDQUFDO1FBR3JFLElBQUksSUFBSSxDQUFDLGVBQWUsSUFBSSxJQUFJLEVBQUU7WUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO2dCQUN2RCxJQUFJLElBQUEsd0JBQWlCLEVBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBQSx3QkFBaUIsRUFBQyw2QkFBNkIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO29CQUN4RyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsNkJBQTZCLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQ3BEO1lBQ0wsQ0FBQyxDQUFDLENBQUM7U0FDTjtRQUVELElBQUksTUFBTSxDQUFDLFNBQVMsSUFBSSxJQUFJLEVBQUU7WUFDMUIsTUFBTSxDQUFDLFNBQVMsR0FBRyxxQkFBUyxDQUFDLG1CQUFtQixDQUFDO1NBQ3BEO1FBRUQsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLEdBQUcsRUFBRTtZQUN2RCxNQUFNLENBQUMsU0FBUyxJQUFJLEdBQUcsQ0FBQztTQUMzQjtRQUtELElBQUksQ0FBQyxJQUFBLHdCQUFpQixFQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNoQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDO1NBQ2hDO1FBSUQsSUFBSSxDQUFDLElBQUEsd0JBQWlCLEVBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFO1lBRzFDLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsRUFBRTthQUV0RDtpQkFBTTtnQkFDSCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxxQkFBUyxDQUFDLDBCQUEwQixDQUFDLENBQUM7YUFDM0Q7U0FDSjtRQUVELElBQUksSUFBQSx3QkFBaUIsRUFBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDdEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsK0JBQStCLENBQUMsQ0FBQztZQUNwRCxNQUFNLENBQUMsVUFBVSxHQUFHLHFCQUFTLENBQUMsU0FBUyxDQUFDO1NBQzNDO2FBQU07WUFDSCxJQUFJLE1BQU0sQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLHFCQUFTLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBRTVELE1BQU0sQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQVUsR0FBRyxxQkFBUyxDQUFDLGNBQWMsQ0FBQzthQUNwRTtTQUNKO1FBRUQsSUFBSSxJQUFBLHdCQUFpQixFQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUN0QyxNQUFNLENBQUMsVUFBVSxHQUFHLHFCQUFTLENBQUMsV0FBVyxDQUFDO1NBQzdDO1FBRUQsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQVNPLGtCQUFrQjtRQUN0QixNQUFNLGlCQUFpQixHQUFHLE9BQUUsQ0FBQyxlQUFlLEVBQUUsQ0FBQztRQUMvQyxJQUFJLGlCQUFpQixDQUFDLG1DQUFnQixDQUFDLElBQUksSUFBSSxFQUFFO1lBRTdDLE9BQU8sRUFBRSxDQUFDO1NBQ2I7YUFBTTtZQUVILE9BQU8saUJBQWlCLENBQUMsbUNBQWdCLENBQUMsQ0FBQztTQUM5QztJQUNMLENBQUM7Q0FFSjtBQWpHRCx3QkFpR0MifQ==