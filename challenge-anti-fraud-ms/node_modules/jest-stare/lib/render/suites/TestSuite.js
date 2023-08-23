"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestSuite = void 0;
const Constants_1 = require("../Constants");
const Test_1 = require("../tests/Test");
class TestSuite {
    static create(results) {
        const elements = [];
        results.testResults.forEach((testResult) => {
            if (testResult.testResults == null) {
                console.error("Unexpected testResults field missing");
                if (testResult.assertionResults != null) {
                    console.warn("Attempting to use assertionResults: results are unpredictable");
                    testResult.testResults = testResult.assertionResults;
                }
            }
            let testStatusClass;
            const testSectionStatus = new Map();
            for (const result of testResult.testResults) {
                testStatusClass = TestSuite.asignStatus(testStatusClass, result, testSectionStatus);
            }
            if (testStatusClass === undefined) {
                testStatusClass = Constants_1.Constants.PASSED_TEST;
            }
            const accordionCard = TestSuite.buildAccordionCard(testResult, testStatusClass);
            const divMap = new Map();
            testResult.testResults.forEach((test) => {
                const element = Test_1.Test.create(test);
                if (test.ancestorTitles.length > 0) {
                    test.ancestorTitles.forEach((title, index) => {
                        const titlesCopy = test.ancestorTitles.slice();
                        titlesCopy.splice(index + 1);
                        const key = titlesCopy.join(TestSuite.JOIN_CHAR);
                        if (divMap.has(key)) {
                            divMap.get(key).appendChild(element);
                        }
                        else {
                            const nestDiv = document.createElement("div");
                            const statusClass = testSectionStatus.get(key) || Constants_1.Constants.PASSED_TEST;
                            nestDiv.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow", statusClass);
                            const h6 = document.createElement("h6");
                            h6.classList.add("border-bottom", "pb-2", "mb-0", "display-6");
                            h6.textContent = title;
                            nestDiv.appendChild(h6);
                            nestDiv.appendChild(element);
                            nestDiv.id = key;
                            divMap.set(key, nestDiv);
                            if (index === 0) {
                                accordionCard.querySelector('.card-body').appendChild(nestDiv);
                            }
                            else {
                                titlesCopy.pop();
                                const parentKey = titlesCopy.join(TestSuite.JOIN_CHAR);
                                divMap.get(parentKey).appendChild(nestDiv);
                            }
                        }
                    });
                }
                else {
                    accordionCard.querySelector('.card-body').appendChild(element);
                }
            });
            elements.push(accordionCard);
        });
        return elements;
    }
    static asignStatus(testStatusClass, result, testSectionStatus) {
        const currentStatus = TestSuite.getStatusClassFromJestStatus(result.status);
        if (!testStatusClass) {
            testStatusClass = currentStatus;
        }
        else if (testStatusClass !== currentStatus) {
            testStatusClass = TestSuite.mixStatus(currentStatus, testStatusClass);
        }
        else {
            testStatusClass = currentStatus;
        }
        for (let index = 0; index < result.ancestorTitles.length; index++) {
            const titlesCopy = result.ancestorTitles.slice();
            titlesCopy.splice(index + 1);
            const key = titlesCopy.join(TestSuite.JOIN_CHAR);
            if (testSectionStatus.has(key)) {
                if (testStatusClass !== currentStatus) {
                    testSectionStatus.set(key, TestSuite.mixStatus(currentStatus, testStatusClass));
                }
                else {
                    testSectionStatus.set(key, currentStatus);
                }
            }
            else {
                testSectionStatus.set(key, currentStatus);
            }
        }
        return testStatusClass;
    }
    static getStatusClassFromJestStatus(jestStatus) {
        if (jestStatus === Constants_1.Constants.TEST_STATUS_PEND) {
            return Constants_1.Constants.PENDING_TEST;
        }
        else if (jestStatus === Constants_1.Constants.TEST_STATUS_FAIL) {
            return Constants_1.Constants.FAILED_TEST;
        }
        else {
            return Constants_1.Constants.PASSED_TEST;
        }
    }
    static mixStatus(currentStatus, oldStatus) {
        const statusArray = oldStatus.split(TestSuite.JOIN_CHAR);
        statusArray.push(currentStatus);
        const sortedUniqueStatusArray = [...new Set(statusArray)].sort();
        return sortedUniqueStatusArray.join(TestSuite.JOIN_CHAR);
    }
    static buildAccordionCard(testResult, testStatusClass) {
        const accordionCard = document.createElement("div");
        accordionCard.classList.add("my-3", "p-3", "bg-white", "rounded", "box-shadow", "card", testStatusClass);
        const cardHeader = TestSuite.buildAccordionCardHeader(testResult.testFilePath, testResult.numPassingTests, testResult.numFailingTests, testResult.numPendingTests, testResult.numTodoTests);
        accordionCard.appendChild(cardHeader);
        const cardBody = TestSuite.buildAccordionCardBody(testResult.testFilePath);
        accordionCard.appendChild(cardBody);
        return accordionCard;
    }
    static buildAccordionCardHeader(testFilePath, passCount, failCount, pendingCount, todoCount) {
        const fileName = TestSuite.sanitizeFilePath(testFilePath);
        const cardHeader = document.createElement("div");
        cardHeader.classList.add("card-header");
        cardHeader.classList.add("text-center");
        cardHeader.id = `${fileName}_header`;
        const h5 = document.createElement("h5");
        h5.classList.add("border-bottom", "pb-2", "mb-0", "display-5");
        const btn = document.createElement("button");
        btn.classList.add("btn", "btn-block");
        btn.setAttribute("data-bs-toggle", "collapse");
        btn.setAttribute("data-bs-target", `#${fileName}_detail`);
        btn.textContent = testFilePath;
        const resultCounts = document.createElement("div");
        const passBadge = document.createElement("span");
        passBadge.classList.add("badge", "bg-success", "border");
        passBadge.textContent = passCount.toString();
        resultCounts.appendChild(passBadge);
        const failBadge = document.createElement("span");
        failBadge.classList.add("badge", "bg-danger", "border");
        failBadge.textContent = failCount.toString();
        resultCounts.appendChild(failBadge);
        const skipBadge = document.createElement("span");
        skipBadge.classList.add("badge", "bg-warning", "border");
        skipBadge.textContent = pendingCount.toString();
        resultCounts.appendChild(skipBadge);
        const todoBadge = document.createElement("span");
        todoBadge.classList.add("badge", "bg-info", "border");
        todoBadge.textContent = todoCount.toString();
        resultCounts.appendChild(todoBadge);
        btn.appendChild(resultCounts);
        h5.appendChild(btn);
        cardHeader.appendChild(h5);
        return cardHeader;
    }
    static buildAccordionCardBody(testFilePath) {
        const fileName = TestSuite.sanitizeFilePath(testFilePath);
        const cardContainer = document.createElement("div");
        cardContainer.classList.add("collapse");
        cardContainer.setAttribute("data-parent", "#accordion");
        cardContainer.id = `${fileName}_detail`;
        const cardBody = document.createElement("div");
        cardBody.classList.add("card-body");
        cardContainer.appendChild(cardBody);
        return cardContainer;
    }
    static sanitizeFilePath(testFilePath) {
        return testFilePath.replace(/(\/)|\\|(:)|(\s)|\.|(@)/g, '_');
    }
}
exports.TestSuite = TestSuite;
TestSuite.JOIN_CHAR = ".";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdFN1aXRlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JlbmRlci9zdWl0ZXMvVGVzdFN1aXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRDQUF5QztBQUN6Qyx3Q0FBcUM7QUFRckMsTUFBYSxTQUFTO0lBZVgsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUF5QjtRQUMxQyxNQUFNLFFBQVEsR0FBa0IsRUFBRSxDQUFDO1FBRW5DLE9BQU8sQ0FBQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFRdkMsSUFBSSxVQUFVLENBQUMsV0FBVyxJQUFJLElBQUksRUFBRTtnQkFFaEMsT0FBTyxDQUFDLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO2dCQUN0RCxJQUFLLFVBQWtCLENBQUMsZ0JBQWdCLElBQUksSUFBSSxFQUFFO29CQUU5QyxPQUFPLENBQUMsSUFBSSxDQUFDLCtEQUErRCxDQUFDLENBQUM7b0JBQzlFLFVBQVUsQ0FBQyxXQUFXLEdBQUksVUFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQztpQkFDakU7YUFDSjtZQUVELElBQUksZUFBZSxDQUFDO1lBRXBCLE1BQU0saUJBQWlCLEdBQXdCLElBQUksR0FBRyxFQUFrQixDQUFDO1lBQ3pFLEtBQUssTUFBTSxNQUFNLElBQUksVUFBVSxDQUFDLFdBQVcsRUFBRTtnQkFDekMsZUFBZSxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsZUFBZSxFQUFFLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO2FBQ3ZGO1lBRUQsSUFBSSxlQUFlLEtBQUssU0FBUyxFQUFFO2dCQUMvQixlQUFlLEdBQUcscUJBQVMsQ0FBQyxXQUFXLENBQUM7YUFDM0M7WUFHRCxNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsa0JBQWtCLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFBO1lBTy9FLE1BQU0sTUFBTSxHQUE2QixJQUFJLEdBQUcsRUFBdUIsQ0FB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