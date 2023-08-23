"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = void 0;
const Constants_1 = require("../Constants");
const AnsiParser = require("ansi-parser");
const TestDifference_1 = require("../diff/TestDifference");
const ImageSnapshotDifference_1 = require("../diff/ImageSnapshotDifference");
class Test {
    static create(innerTestResult) {
        let color = Constants_1.Constants.PASS_RAW;
        let testStatusClass = Constants_1.Constants.PASSED_TEST;
        let failed = false;
        switch (innerTestResult.status) {
            case Constants_1.Constants.TEST_STATUS_FAIL:
                color = Constants_1.Constants.FAIL_RAW;
                testStatusClass = Constants_1.Constants.FAILED_TEST;
                failed = true;
                break;
            case Constants_1.Constants.TEST_STATUS_PEND:
                color = Constants_1.Constants.PENDING_RAW;
                testStatusClass = Constants_1.Constants.PENDING_TEST;
                break;
            case Constants_1.Constants.TEST_STATUS_TODO:
                color = Constants_1.Constants.TODO_RAW;
                testStatusClass = Constants_1.Constants.TODO_TEST;
                break;
            case Constants_1.Constants.TEST_STATUS_PASS:
                break;
            default:
                break;
        }
        const firstDiv = document.createElement("div");
        firstDiv.classList.add("media", "text-muted", "pt-3", testStatusClass);
        const img = document.createElement("img");
        img.classList.add("mr-2", "rounded");
        img.alt = "";
        img.setAttribute("data-src", "holder.js/32x32?theme=thumb&bg=" + color + "&fg=" + color + "&size=1");
        firstDiv.appendChild(img);
        const secondDiv = document.createElement("div");
        secondDiv.classList.add("media-body", "pb-3", "mb-0", "small", "lh-125", "border-bottom", "overflow-auto");
        firstDiv.appendChild(secondDiv);
        const thirdDiv = document.createElement("div");
        thirdDiv.classList.add("d-flex", "justify-content-between", "align-items-center", "w-100");
        secondDiv.appendChild(thirdDiv);
        const strong = document.createElement("strong");
        strong.classList.add("text-gray-dark");
        strong.textContent = innerTestResult.title;
        const titleId = innerTestResult.title.replace(/\s+/g, "-").toLowerCase();
        const diffId = titleId + "-diff";
        thirdDiv.appendChild(strong);
        const small = document.createElement("small");
        small.classList.add("d-block", "text-right", "mt-3");
        const conversionValu = 1000;
        small.textContent = innerTestResult.duration / conversionValu + "s";
        thirdDiv.appendChild(small);
        const span = document.createElement("span");
        span.classList.add("d-block", "mb-2");
        span.textContent = innerTestResult.status;
        secondDiv.appendChild(span);
        if (failed) {
            const failMessage = AnsiParser.removeAnsi(innerTestResult.failureMessages[0]);
            const failMessageSplit = failMessage.split("\n");
            let show = true;
            if (failMessage.search(TestDifference_1.TestDifference.DIFF_INDICATOR) >= 0) {
                const diffHtml = TestDifference_1.TestDifference.generate(failMessage);
                secondDiv.appendChild(diffHtml);
                show = false;
            }
            if (ImageSnapshotDifference_1.ImageSnapshotDifference.containsDiff(failMessage)) {
                const diffHtml = ImageSnapshotDifference_1.ImageSnapshotDifference.generate(failMessage);
                secondDiv.appendChild(diffHtml);
                show = false;
            }
            const collapseDiv = document.createElement("div");
            collapseDiv.classList.add("d-flex", "justify-content-between", "align-items-center", "w-100");
            const worthlessDiv = document.createElement("div");
            secondDiv.appendChild(collapseDiv);
            collapseDiv.appendChild(worthlessDiv);
            const button = document.createElement("button");
            button.classList.add("btn", "btn-light", "btn-sm");
            button.type = "button";
            button.setAttribute("data-bs-toggle", "collapse");
            button.setAttribute("data-bs-target", "#" + diffId);
            button.setAttribute("aria-expanded", "false");
            button.setAttribute("aria-controls", diffId);
            button.textContent = "raw";
            collapseDiv.appendChild(button);
            const pre = document.createElement("pre");
            secondDiv.appendChild(pre);
            pre.classList.add("collapse");
            if (show) {
                pre.classList.add("show");
            }
            pre.id = diffId;
            const code = document.createElement("code");
            pre.appendChild(code);
            failMessageSplit.forEach((entry, index) => {
                const codeSpan = document.createElement("span");
                if (entry[0] === "+") {
                    codeSpan.setAttribute("style", "color:" + Constants_1.Constants.PASS);
                    codeSpan.textContent = entry;
                }
                else if (entry[0] === "-") {
                    codeSpan.setAttribute("style", "color:" + Constants_1.Constants.FAIL);
                    codeSpan.textContent = entry;
                }
                else {
                    codeSpan.textContent = entry;
                }
                const spanDiv = document.createElement("div");
                spanDiv.appendChild(codeSpan);
                code.appendChild(spanDiv);
            });
        }
        firstDiv.id = titleId;
        return firstDiv;
    }
}
exports.Test = Test;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZW5kZXIvdGVzdHMvVGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw0Q0FBeUM7QUFDekMsMENBQTBDO0FBQzFDLDJEQUF3RDtBQUN4RCw2RUFBMEU7QUFRMUUsTUFBYSxJQUFJO0lBVU4sTUFBTSxDQUFDLE1BQU0sQ0FBQyxlQUEyQztRQUM1RCxJQUFJLEtBQUssR0FBRyxxQkFBUyxDQUFDLFFBQVEsQ0FBQztRQUMvQixJQUFJLGVBQWUsR0FBRyxxQkFBUyxDQUFDLFdBQVcsQ0FBQztRQUM1QyxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFFbkIsUUFBUSxlQUFlLENBQUMsTUFBTSxFQUFFO1lBQzVCLEtBQUsscUJBQVMsQ0FBQyxnQkFBZ0I7Z0JBQzNCLEtBQUssR0FBRyxxQkFBUyxDQUFDLFFBQVEsQ0FBQztnQkFDM0IsZUFBZSxHQUFHLHFCQUFTLENBQUMsV0FBVyxDQUFDO2dCQUN4QyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUNkLE1BQU07WUFDVixLQUFLLHFCQUFTLENBQUMsZ0JBQWdCO2dCQUMzQixLQUFLLEdBQUcscUJBQVMsQ0FBQyxXQUFXLENBQUM7Z0JBQzlCLGVBQWUsR0FBRyxxQkFBUyxDQUFDLFlBQVksQ0FBQztnQkFDekMsTUFBTTtZQUNWLEtBQUsscUJBQVMsQ0FBQyxnQkFBZ0I7Z0JBQzNCLEtBQUssR0FBRyxxQkFBUyxDQUFDLFFBQVEsQ0FBQztnQkFDM0IsZUFBZSxHQUFHLHFCQUFTLENBQUMsU0FBUyxDQUFDO2dCQUN0QyxNQUFNO1lBQ1YsS0FBSyxxQkFBUyxDQUFDLGdCQUFnQjtnQkFDM0IsTUFBTTtZQUNWO2dCQUNJLE1BQU07U0FDYjtRQUVELE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFtQixDQUFDO1FBQ2pFLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFB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