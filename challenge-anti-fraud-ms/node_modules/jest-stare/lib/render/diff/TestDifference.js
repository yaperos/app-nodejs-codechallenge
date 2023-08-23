"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestDifference = void 0;
const diff2html = require("diff2html");
const $ = require("jquery");
class TestDifference {
    static containsDiff(jestFailureMessage) {
        return jestFailureMessage.search(TestDifference.DIFF_INDICATOR) >= 0;
    }
    static generate(jestFailureMessage) {
        const jestDiff = TestDifference.isolateDiff(jestFailureMessage);
        const diffjson = diff2html.parse(jestDiff);
        const diffHtml = diff2html.html(diffjson, {
            drawFileList: false,
            outputFormat: "side-by-side",
            matching: "lines"
        });
        return $(diffHtml).get(0);
    }
    static isolateDiff(jestFailureMessage) {
        const beginIndex = jestFailureMessage.search(TestDifference.DIFF_INDICATOR);
        const endIndex = jestFailureMessage.search(TestDifference.DIFF_END_INDICATOR);
        let isolated = jestFailureMessage.substring(beginIndex, endIndex);
        let snapshotChanges = 0;
        let receivedChanges = 0;
        const changeLines = isolated.split(/\r?\n/g);
        for (const line of changeLines) {
            if (/^- /.test(line)) {
                snapshotChanges++;
            }
            else if (/^\+ /.test(line)) {
                receivedChanges++;
            }
        }
        const changesIndicator = `\n@@ -0,${snapshotChanges} +0,${receivedChanges} @@\n`;
        isolated = isolated.replace("- Snapshot", "--- Snapshot");
        isolated = isolated.replace("+ Received", "+++ Received");
        const lines = isolated.split(/\r?\n/g);
        lines.splice(2, 0, changesIndicator);
        return lines.join(`\n`);
    }
}
exports.TestDifference = TestDifference;
TestDifference.DIFF_INDICATOR = /- Snapshot\s*(\-\s*[0-9]+)?\n\s*\+ Received\s*(\+\s*[0-9]+)?/g;
TestDifference.DIFF_END_INDICATOR = /(at .*? \(.*?:[0-9]+:[0-9]+\)\s)/g;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdERpZmZlcmVuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcmVuZGVyL2RpZmYvVGVzdERpZmZlcmVuY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsdUNBQXVDO0FBQ3ZDLDRCQUE0QjtBQU81QixNQUFhLGNBQWM7SUFnQmhCLE1BQU0sQ0FBQyxZQUFZLENBQUMsa0JBQTBCO1FBQ2pELE9BQU8sa0JBQWtCLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDekUsQ0FBQztJQVNNLE1BQU0sQ0FBQyxRQUFRLENBQUMsa0JBQTBCO1FBQzdDLE1BQU0sUUFBUSxHQUFHLGNBQWMsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQztRQUNoRSxNQUFNLFFBQVEsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzNDLE1BQU0sUUFBUSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQzNCLFFBQVEsRUFDUjtZQUNJLFlBQVksRUFBRSxLQUFLO1lBQ25CLFlBQVksRUFBRSxjQUFjO1lBQzVCLFFBQVEsRUFBRSxPQUFPO1NBQ3BCLENBQ0osQ0FBQztRQUVGLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBV08sTUFBTSxDQUFDLFdBQVcsQ0FBQyxrQkFBMEI7UUFDakQsTUFBTSxVQUFVLEdBQUcsa0JBQWtCLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUM1RSxNQUFNLFFBQVEsR0FBRyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLENBQUM7UUFDOUUsSUFBSSxRQUFRLEdBQUcsa0JBQWtCLENBQUMsU0FBUyxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztRQUVsRSxJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUM7UUFDeEIsSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLE1BQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0MsS0FBSyxNQUFNLElBQUksSUFBSSxXQUFXLEVBQUU7WUFDNUIsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUNsQixlQUFlLEVBQUUsQ0FBQzthQUNyQjtpQkFBTSxJQUFJLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQzFCLGVBQWUsRUFBRSxDQUFDO2FBQ3JCO1NBQ0o7UUFDRCxNQUFNLGdCQUFnQixHQUFHLFdBQVcsZUFBZSxPQUFPLGVBQWUsT0FBTyxDQUFDO1FBQ2pGLFFBQVEsR0FBRyxRQUFRLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxjQUFjLENBQUMsQ0FBQztRQUUxRCxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDMUQsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2QyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUVyQyxPQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUIsQ0FBQzs7QUExRUwsd0NBMkVDO0FBckVpQiw2QkFBYyxHQUFXLCtEQUErRCxDQUFDO0FBRXpGLGlDQUFrQixHQUFXLG1DQUFtQyxDQUFDIn0=