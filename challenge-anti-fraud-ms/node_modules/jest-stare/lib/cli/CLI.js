"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CLI = void 0;
const Logger_1 = require("../utils/Logger");
const Constants_1 = require("../processor/Constants");
const IO_1 = require("../utils/IO");
const Processor_1 = require("../processor/Processor");
const yargs = require("yargs");
class CLI {
    static run(argv) {
        const args = yargs
            .usage("$0 <testResults> [resultDir]", "jest-stare CLI", (y) => y
            .positional("testResults", { type: "string" })
            .positional("resultDir", { type: "string" }))
            .options({
            coverageLink: {
                type: "string",
                description: "Link to coverage report for convenient referencing in top left of HTML report"
            }
        })
            .strict()
            .parse(argv);
        const config = {};
        if (args.testResults == null) {
            Logger_1.Logger.get.error(Constants_1.Constants.NO_CLI_INPUT);
            throw new Error();
        }
        if (args.resultDir != null) {
            config.resultDir = args.resultDir;
        }
        if (args.coverageLink != null) {
            config.coverageLink = args.coverageLink;
        }
        const results = IO_1.IO.readFileSync(args.testResults);
        Processor_1.Processor.run(JSON.parse(results), config);
    }
}
exports.CLI = CLI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ0xJLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2NsaS9DTEkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsNENBQXlDO0FBQ3pDLHNEQUFtRDtBQUNuRCxvQ0FBaUM7QUFDakMsc0RBQW1EO0FBQ25ELCtCQUErQjtBQU8vQixNQUFhLEdBQUc7SUFPTCxNQUFNLENBQUMsR0FBRyxDQUFDLElBQWM7UUFDNUIsTUFBTSxJQUFJLEdBQUcsS0FBSzthQUNiLEtBQUssQ0FBQyw4QkFBOEIsRUFBRSxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsRUFBRSxFQUFFLENBQzNELENBQUM7YUFDSSxVQUFVLENBQUMsYUFBYSxFQUFFLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDO2FBQzdDLFVBQVUsQ0FBQyxXQUFXLEVBQUUsRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLENBQUMsQ0FDbkQ7YUFDQSxPQUFPLENBQUM7WUFDTCxZQUFZLEVBQUU7Z0JBQ1YsSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsV0FBVyxFQUNQLCtFQUErRTthQUN0RjtTQUNKLENBQUM7YUFDRCxNQUFNLEVBQUU7YUFDUixLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFakIsTUFBTSxNQUFNLEdBQXFCLEVBQUUsQ0FBQztRQUVwQyxJQUFLLElBQVksQ0FBQyxXQUFXLElBQUksSUFBSSxFQUFFO1lBQ25DLGVBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLHFCQUFTLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDekMsTUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO1NBQ3JCO1FBRUQsSUFBSyxJQUFZLENBQUMsU0FBUyxJQUFJLElBQUksRUFBRTtZQUNqQyxNQUFNLENBQUMsU0FBUyxHQUFJLElBQVksQ0FBQyxTQUFtQixDQUFDO1NBQ3hEO1FBRUQsSUFBSyxJQUFZLENBQUMsWUFBWSxJQUFJLElBQUksRUFBRTtZQUNwQyxNQUFNLENBQUMsWUFBWSxHQUFJLElBQVksQ0FBQyxZQUFZLENBQUM7U0FDcEQ7UUFFRCxNQUFNLE9BQU8sR0FBRyxPQUFFLENBQUMsWUFBWSxDQUFFLElBQVksQ0FBQyxXQUFxQixDQUFDLENBQUM7UUFDckUscUJBQVMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMvQyxDQUFDO0NBQ0o7QUExQ0Qsa0JBMENDIn0=