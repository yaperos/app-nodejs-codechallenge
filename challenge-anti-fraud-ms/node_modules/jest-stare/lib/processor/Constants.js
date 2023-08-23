"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
const chalk = require("chalk");
class Constants {
}
exports.Constants = Constants;
Constants.NAME = "jest-stare";
Constants.LOGO = chalk.green("**  ") + chalk.green("jest") + chalk.yellow("-") + chalk.red("stare");
Constants.SUFFIX = chalk.green("\t**");
Constants.DEFAULT_RESULTS_DIR = "./" + Constants.NAME;
Constants.HTML_EXTENSION = ".html";
Constants.MAIN_HTML = "index" + Constants.HTML_EXTENSION;
Constants.JEST_STARE_JS = "view.js";
Constants.REPORTER_WRITTING = " will write each completed run to ";
Constants.RESULTS_RAW = "jest-results.json";
Constants.JEST_STARE_CSS = Constants.NAME + ".css";
Constants.TEMPLATE_HTML = "template.html";
Constants.CSS_DIR = "css/";
Constants.JS_DIR = "js/";
Constants.IMAGE_SNAPSHOT_DIFF_DIR = "image_snapshot_diff/";
Constants.TEST_RESULTS_PROCESSOR = "--testResultsProcessor";
Constants.REPORTERS = "--reporters";
Constants.LOG_MESSAGE = ": wrote output report to ";
Constants.MERGE_MESSAGE = ": will merge with ";
Constants.NO_INPUT = Constants.NAME + " was called without input results";
Constants.NO_CLI_INPUT = Constants.NAME + " CLI was called without input JSON file to read";
Constants.OVERRIDE_JEST_STARE_CONFIG = Constants.NAME + " was called with programmatic config";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29uc3RhbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Byb2Nlc3Nvci9Db25zdGFudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsK0JBQStCO0FBTy9CLE1BQWEsU0FBUzs7QUFBdEIsOEJBcUpDO0FBOUkwQixjQUFJLEdBQUcsWUFBWSxDQUFDO0FBT3BCLGNBQUksR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBTzFGLGdCQUFNLEdBQUcsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQztBQU83Qiw2QkFBbUIsR0FBRyxJQUFJLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQztBQU81Qyx3QkFBYyxHQUFHLE9BQU8sQ0FBQztBQVF6QixtQkFBUyxHQUFHLE9BQU8sR0FBRyxTQUFTLENBQUMsY0FBYyxDQUFDO0FBTy9DLHVCQUFhLEdBQUcsU0FBUyxDQUFDO0FBTzFCLDJCQUFpQixHQUFHLG9DQUFvQyxDQUFDO0FBT3pELHFCQUFXLEdBQUcsbUJBQW1CLENBQUM7QUFPbEMsd0JBQWMsR0FBRyxTQUFTLENBQUMsSUFBSSxHQUFHLE1BQU0sQ0FBQztBQU96Qyx1QkFBYSxHQUFHLGVBQWUsQ0FBQztBQU9oQyxpQkFBTyxHQUFHLE1BQU0sQ0FBQztBQU9qQixnQkFBTSxHQUFHLEtBQUssQ0FBQztBQU9mLGlDQUF1QixHQUFHLHNCQUFzQixDQUFDO0FBT2pELGdDQUFzQixHQUFHLHdCQUF3QixDQUFDO0FBT2xELG1CQUFTLEdBQUcsYUFBYSxDQUFDO0FBTzFCLHFCQUFXLEdBQUcsMkJBQTJCLENBQUM7QUFPMUMsdUJBQWEsR0FBRyxvQkFBb0IsQ0FBQztBQU9yQyxrQkFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJLEdBQUcsbUNBQW1DLENBQUM7QUFPaEUsc0JBQVksR0FBRyxTQUFTLENBQUMsSUFBSSxHQUFHLGlEQUFpRCxDQUFDO0FBT2xGLG9DQUEwQixHQUFHLFNBQVMsQ0FBQyxJQUFJLEdBQUcsc0NBQXNDLENBQUMifQ==