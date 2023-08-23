"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Test = void 0;
const Constants_1 = require("../Constants");
class Test {
    static create(innerTestResult) {
        const containerDiv = document.createElement("div");
        const anchor = document.createElement("a");
        anchor.href = "#" + innerTestResult.title.replace(/\s+/g, "-").toLowerCase();
        const testName = document.createElement("span");
        testName.textContent = innerTestResult.title;
        anchor.appendChild(Test.getSimbolSpanFromStatus(innerTestResult.status));
        anchor.appendChild(testName);
        containerDiv.appendChild(anchor);
        return containerDiv;
    }
    static getSimbolSpanFromStatus(status) {
        const span = document.createElement("span");
        span.classList.add("summary-test-label", "test");
        if (status === Constants_1.Constants.TEST_STATUS_PASS) {
            span.textContent = "✓";
            span.classList.add("pass");
        }
        if (status === Constants_1.Constants.TEST_STATUS_PEND) {
            span.textContent = "O";
            span.classList.add("pending");
        }
        if (status === Constants_1.Constants.TEST_STATUS_FAIL) {
            span.textContent = "X";
            span.classList.add("fail");
        }
        return span;
    }
}
exports.Test = Test;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9yZW5kZXIvc3VtbWFyeS9UZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRDQUF5QztBQVF6QyxNQUFhLElBQUk7SUFVTixNQUFNLENBQUMsTUFBTSxDQUFDLGVBQWdDO1FBQ2pELE1BQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFtQixDQUFDO1FBRXJFLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFzQixDQUFDO1FBQ2hFLE1BQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUU3RSxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBZ0IsQ0FBQztRQUMvRCxRQUFRLENBQUMsV0FBVyxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUM7UUFFN0MsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsZUFBZSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDekUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUU3QixZQUFZLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRWpDLE9BQU8sWUFBWSxDQUFDO0lBQ3hCLENBQUM7SUFTTyxNQUFNLENBQUUsdUJBQXVCLENBQUMsTUFBYztRQUNsRCxNQUFNLElBQUksR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBb0IsQ0FBQztRQUMvRCxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUVqRCxJQUFJLE1BQU0sS0FBSyxxQkFBUyxDQUFDLGdCQUFnQixFQUFFO1lBQ3ZDLElBQUksQ0FBQyxXQUFXLEdBQUcsR0FBRyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzlCO1FBRUQsSUFBSSxNQUFNLEtBQUsscUJBQVMsQ0FBQyxnQkFBZ0IsRUFBRTtZQUN2QyxJQUFJLENBQUMsV0FBVyxHQUFHLEdBQUcsQ0FBQztZQUN2QixJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNqQztRQUVELElBQUksTUFBTSxLQUFLLHFCQUFTLENBQUMsZ0JBQWdCLEVBQUU7WUFDdkMsSUFBSSxDQUFDLFdBQVcsR0FBRyxHQUFHLENBQUM7WUFDdkIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDOUI7UUFFRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0NBQ0o7QUF2REQsb0JBdURDIn0=