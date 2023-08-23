"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestSummary = void 0;
const Test_1 = require("./Test");
class TestSummary {
    static create(results) {
        const elements = [];
        const div = document.createElement("div");
        div.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow", "summary");
        const h5 = document.createElement("h5");
        h5.classList.add("border-bottom", "pb-2", "display-5", "summary-title");
        h5.textContent = "Summary";
        div.appendChild(h5);
        div.id = "test-summary";
        elements.push(div);
        results.testResults.forEach((testResult) => {
            if (testResult.testResults == null) {
                console.error("Unexpected testResults field missing");
                if (testResult.assertionResults != null) {
                    console.warn("Attempting to use assertionResults: results are unpredictable");
                    testResult.testResults = testResult.assertionResults;
                }
            }
            const divMap = new Map();
            const testTitleDiv = document.createElement("div");
            testTitleDiv.classList.add("summary-test-suite");
            const testFileLink = document.createElement("a");
            const passingTestsCount = "[" + testResult.numPassingTests + "/" + testResult.testResults.length + "]";
            const isPass = (testResult.testResults.length - (testResult.numPassingTests + testResult.numPendingTests)) === 0;
            const testStatus = document.createElement("strong");
            testStatus.classList.add("summary-test-label");
            if (isPass) {
                testStatus.classList.add("pass");
                testStatus.textContent = "PASS";
            }
            else {
                testStatus.classList.add("fail");
                testStatus.textContent = "FAIL";
            }
            const testFileLine = document.createElement("strong");
            testFileLine.classList.add("summary-test-label", "path");
            testFileLine.textContent = testResult.testFilePath;
            const testCount = document.createElement("strong");
            testCount.classList.add("summary-test-count");
            testCount.textContent = passingTestsCount;
            testFileLink.href = "#" + testResult.testFilePath;
            testFileLink.appendChild(testStatus);
            testFileLink.appendChild(testFileLine);
            testFileLink.appendChild(testCount);
            testTitleDiv.appendChild(testFileLink);
            div.appendChild(testTitleDiv);
            testResult.testResults.forEach((test) => {
                const testDetail = Test_1.Test.create(test);
                div.appendChild(testDetail);
            });
        });
        return elements;
    }
}
exports.TestSummary = TestSummary;
TestSummary.JOIN_CHAR = ".";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdFN1bW1hcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvcmVuZGVyL3N1bW1hcnkvVGVzdFN1bW1hcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQTRCO0FBUTVCLE1BQWEsV0FBVztJQWViLE1BQU0sQ0FBQyxNQUFNLENBQUMsT0FBeUI7UUFDMUMsTUFBTSxRQUFRLEdBQWtCLEVBQUUsQ0FBQztRQUVuQyxNQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBbUIsQ0FBQztRQUM1RCxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxTQUFTLEVBQUUsWUFBWSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRWpGLE1BQU0sRUFBRSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUF1QixDQUFDO1FBQzlELEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1FBQ3hFLEVBQUUsQ0FBQyxXQUFXLEdBQUcsU0FBUyxDQUFDO1FBRTNCLEdBQUcsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDcEIsR0FBRyxDQUFDLEVBQUUsR0FBRyxjQUFjLENBQUM7UUFDeEIsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVuQixPQUFPLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFVBQVUsRUFBRSxFQUFFO1lBUXZDLElBQUksVUFBVSxDQUFDLFdBQVcsSUFBSSxJQUFJLEVBQUU7Z0JBRWhDLE9BQU8sQ0FBQyxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztnQkFDdEQsSUFBSyxVQUFrQixDQUFDLGdCQUFnQixJQUFJLElBQUksRUFBRTtvQkFFOUMsT0FBTyxDQUFDLElBQUksQ0FBQywrREFBK0QsQ0FBQyxDQUFDO29CQUM5RSxVQUFVLENBQUMsV0FBVyxHQUFJLFVBQWtCLENBQUMsZ0JBQWdCLENBQUM7aUJBQ2pFO2FBQ0o7WUFFRCxNQUFNLE1BQU0sR0FBNkIsSUFBSSxHQUFHLEVBQXVCLENBQUM7WUFFeEUsTUFBTSxZQUFZLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQW1CLENBQUM7WUFDckUsWUFBWSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUVqRCxNQUFNLFlBQVksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBc0IsQ0FBQztZQUN0RSxNQUFNLGlCQUFpQixHQUFHLEdBQUcsR0FBRyxVQUFVLENBQUMsZUFBZSxHQUFHLEdBQUcsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUM7WUFDdkcsTUFBTSxNQUFNLEdBQ1IsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLFVBQVUsQ0FBQyxlQUFlLEdBQUcsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBRXRHLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFvQixDQUFDO1lBRXZFLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFDLENBQUM7WUFDL0MsSUFBSSxNQUFNLEVBQUU7Z0JBQ1IsVUFBVSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQ2pDLFVBQVUsQ0FBQyxXQUFXLEdBQUcsTUFBTSxDQUFDO2FBQ25DO2lCQUFNO2dCQUNILFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNqQyxVQUFVLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQzthQUNuQztZQUVELE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFvQixDQUFDO1lBQ3pFLFlBQVksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLG9CQUFvQixFQUFFLE1BQU0sQ0FBQyxDQUFDO1lBQ3pELFlBQVksQ0FBQyxXQUFXLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQztZQUVuRCxNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBb0IsQ0FBQztZQUN0RSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQzlDLFNBQVMsQ0FBQyxXQUFXLEdBQUcsaUJBQWlCLENBQUM7WUFFMUMsWUFBWSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsVUFBVSxDQUFDLFlBQVksQ0FBQztZQUNsRCxZQUFZLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ3JDLFlBQVksQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7WUFDdkMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQztZQUVwQyxZQUFZLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3ZDLEdBQUcsQ0FBQyxXQUFXLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFOUIsVUFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEVBQUUsRUFBRTtnQkFDcEMsTUFBTSxVQUFVLEdBQUcsV0FBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDckMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNoQyxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxRQUFRLENBQUM7SUFDcEIsQ0FBQzs7QUEzRkwsa0NBNEZDO0FBckYwQixxQkFBUyxHQUFHLEdBQUcsQ0FBQyJ9