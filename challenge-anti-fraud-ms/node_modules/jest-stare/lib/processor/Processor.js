"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Processor = void 0;
const Constants_1 = require("./Constants");
const IO_1 = require("../utils/IO");
const mustache = require("mustache");
const path = require("path");
const Logger_1 = require("../utils/Logger");
const chalk = require("chalk");
const Dependencies_1 = require("./Dependencies");
const util_1 = require("util");
const Config_1 = require("./Config");
const ImageSnapshotDifference_1 = require("../render/diff/ImageSnapshotDifference");
class Processor {
    static run(results, explicitConfig, parms) {
        return new Processor(results, explicitConfig, parms).generate();
    }
    constructor(mResults, mExplicitConfig, mProcessParms) {
        this.mResults = mResults;
        this.mExplicitConfig = mExplicitConfig;
        this.mProcessParms = mProcessParms;
    }
    generate() {
        const substitute = {};
        if ((0, util_1.isNullOrUndefined)(this.mResults)) {
            throw new Error(Constants_1.Constants.NO_INPUT);
        }
        const config = new Config_1.Config(this.logger, this.mExplicitConfig, this.mProcessParms).buildConfig();
        substitute.results = this.mResults;
        substitute.rawResults = JSON.stringify(this.mResults, null, 2);
        substitute.jestStareConfig = config;
        substitute.rawJestStareConfig = JSON.stringify(config, null, 2);
        if (this.mProcessParms && this.mProcessParms.reporter) {
            this.mProcessParms.reporter.jestStareConfig = config;
            substitute.globalConfig = JSON.stringify(this.mProcessParms.reporter.mGlobalConfig, null, 2);
        }
        this.generateReport(config.resultDir, substitute, this.mProcessParms);
        this.collectImageSnapshots(config.resultDir, this.mResults);
        if (config.additionalResultsProcessors != null) {
            this.execute(this.mResults, config.additionalResultsProcessors);
        }
        return this.mResults;
    }
    collectImageSnapshots(resultDir, results) {
        results.testResults.forEach((rootResult) => {
            if (rootResult.numFailingTests) {
                rootResult.testResults.forEach((testResult) => {
                    testResult.failureMessages.forEach((failureMessage) => {
                        if (typeof failureMessage === "string" &&
                            ImageSnapshotDifference_1.ImageSnapshotDifference.containsDiff(failureMessage)) {
                            const diffImagePath = ImageSnapshotDifference_1.ImageSnapshotDifference.parseDiffImagePath(failureMessage);
                            const diffImageName = ImageSnapshotDifference_1.ImageSnapshotDifference.parseDiffImageName(failureMessage);
                            if (IO_1.IO.existsSync(diffImagePath)) {
                                IO_1.IO.mkdirsSync(resultDir + Constants_1.Constants.IMAGE_SNAPSHOT_DIFF_DIR);
                                const reportDiffImagePath = resultDir + Constants_1.Constants.IMAGE_SNAPSHOT_DIFF_DIR + diffImageName;
                                IO_1.IO.copyFileSync(diffImagePath, reportDiffImagePath);
                            }
                        }
                    });
                });
            }
        });
    }
    generateReport(resultDir, substitute, parms) {
        IO_1.IO.mkdirsSync(resultDir);
        IO_1.IO.writeFileSync(resultDir + substitute.jestStareConfig.resultJson, substitute.rawResults);
        if (substitute.jestStareConfig.jestStareConfigJson) {
            IO_1.IO.writeFileSync(resultDir + substitute.jestStareConfig.jestStareConfigJson, substitute.rawJestStareConfig);
        }
        if (substitute.globalConfig && substitute.jestStareConfig.jestGlobalConfigJson) {
            IO_1.IO.writeFileSync(resultDir + substitute.jestStareConfig.jestGlobalConfigJson, substitute.globalConfig);
        }
        if (substitute.jestStareConfig.report != null && !substitute.jestStareConfig.report) {
            return;
        }
        IO_1.IO.writeFileSync(resultDir + substitute.jestStareConfig.resultHtml, mustache.render(this.obtainWebFile(Constants_1.Constants.TEMPLATE_HTML), substitute));
        const cssDir = resultDir + Constants_1.Constants.CSS_DIR;
        IO_1.IO.mkdirsSync(cssDir);
        IO_1.IO.writeFileSync(cssDir + Constants_1.Constants.JEST_STARE_CSS, this.obtainWebFile(Constants_1.Constants.JEST_STARE_CSS));
        const jsDir = resultDir + Constants_1.Constants.JS_DIR;
        IO_1.IO.mkdirsSync(jsDir);
        IO_1.IO.writeFileSync(jsDir + Constants_1.Constants.JEST_STARE_JS, this.obtainJsRenderFile(Constants_1.Constants.JEST_STARE_JS));
        Dependencies_1.Dependencies.THIRD_PARTY_DEPENDENCIES.forEach((dependency) => {
            const updatedDependency = Object.assign({}, ...[dependency]);
            updatedDependency.targetDir = resultDir + dependency.targetDir;
            this.addThirdParty(updatedDependency);
        });
        let type = " ";
        type += (parms && parms.reporter) ? Constants_1.Constants.REPORTERS : Constants_1.Constants.TEST_RESULTS_PROCESSOR;
        this.logger.info(Constants_1.Constants.LOGO + type + Constants_1.Constants.LOG_MESSAGE + resultDir + substitute.jestStareConfig.resultHtml + Constants_1.Constants.SUFFIX);
    }
    execute(jestTestData, processors) {
        for (const processor of processors) {
            if (processor === Constants_1.Constants.NAME) {
                this.logger.error("Error: In order to avoid infinite loops, " +
                    "jest-stare cannot be listed as an additional processor. Skipping... ");
                continue;
            }
            try {
                require(processor)(jestTestData);
                this.logger.info(Constants_1.Constants.LOGO + " passed results to additional processor " +
                    chalk.white("\"" + processor + "\"") + Constants_1.Constants.SUFFIX);
            }
            catch (e) {
                this.logger.error("Error executing additional processor: \"" + processor + "\" " + e);
            }
        }
    }
    addThirdParty(dependency) {
        return __awaiter(this, void 0, void 0, function* () {
            const location = require.resolve(dependency.requireDir + dependency.file);
            yield IO_1.IO.writeFileSync(dependency.targetDir + dependency.file, IO_1.IO.readFileSync(location));
        });
    }
    obtainWebFile(name) {
        return IO_1.IO.readFileSync(path.resolve(__dirname + "/../../web/" + name));
    }
    obtainJsRenderFile(name) {
        return IO_1.IO.readFileSync(path.resolve(__dirname + "/../render/" + name));
    }
    set logger(logger) {
        this.mLog = logger;
    }
    get logger() {
        if ((0, util_1.isNullOrUndefined)(this.mLog)) {
            this.logger = new Logger_1.Logger();
        }
        return this.mLog;
    }
}
exports.Processor = Processor;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUHJvY2Vzc29yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Byb2Nlc3Nvci9Qcm9jZXNzb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQXdDO0FBRXhDLG9DQUFpQztBQUNqQyxxQ0FBcUM7QUFDckMsNkJBQTZCO0FBRTdCLDRDQUF5QztBQUN6QywrQkFBK0I7QUFFL0IsaURBQThDO0FBQzlDLCtCQUF5QztBQUV6QyxxQ0FBa0M7QUFDbEMsb0ZBQWlGO0FBUWpGLE1BQWEsU0FBUztJQVdYLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBeUIsRUFBRSxjQUFpQyxFQUFFLEtBQXFCO1FBRWpHLE9BQU8sSUFBSSxTQUFTLENBQUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNwRSxDQUFDO0lBaUJELFlBQW9CLFFBQTBCLEVBQVUsZUFBa0MsRUFBVSxhQUE2QjtRQUE3RyxhQUFRLEdBQVIsUUFBUSxDQUFrQjtRQUFVLG9CQUFlLEdBQWYsZUFBZSxDQUFtQjtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFnQjtJQUNqSSxDQUFDO0lBUU8sUUFBUTtRQUNaLE1BQU0sVUFBVSxHQUFnQixFQUFFLENBQUM7UUFHbkMsSUFBSSxJQUFBLHdCQUFpQixFQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNsQyxNQUFNLElBQUksS0FBSyxDQUFDLHFCQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDdkM7UUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLGVBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBRy9GLFVBQVUsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUNuQyxVQUFVLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxT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