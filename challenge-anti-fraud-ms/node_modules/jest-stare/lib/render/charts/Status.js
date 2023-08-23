"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Status = void 0;
class Status {
    static setResultsClass(statusElement, passed, failed) {
        const total = passed + failed;
        if (total === 0) {
            statusElement.addClass("list-group-item-info");
        }
        else {
            if (passed === 0) {
                statusElement.addClass("list-group-item-danger");
            }
            else if (passed === total) {
                statusElement.addClass("list-group-item-success");
            }
            else {
                statusElement.addClass("list-group-item-warning");
            }
        }
    }
}
exports.Status = Status;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhdHVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JlbmRlci9jaGFydHMvU3RhdHVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLE1BQWEsTUFBTTtJQVVSLE1BQU0sQ0FBQyxlQUFlLENBQUMsYUFBMkMsRUFBRSxNQUFjLEVBQUUsTUFBYztRQUVyRyxNQUFNLEtBQUssR0FBVyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBRXRDLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNiLGFBQWEsQ0FBQyxRQUFRLENBQUMsc0JBQXNCLENBQUMsQ0FBQztTQUNsRDthQUFNO1lBQ0gsSUFBSSxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUNkLGFBQWEsQ0FBQyxRQUFRLENBQUMsd0JBQXdCLENBQUMsQ0FBQzthQUNwRDtpQkFBTSxJQUFJLE1BQU0sS0FBSyxLQUFLLEVBQUU7Z0JBQ3pCLGFBQWEsQ0FBQyxRQUFRLENBQUMseUJBQXlCLENBQUMsQ0FBQzthQUNyRDtpQkFBTTtnQkFDSCxhQUFhLENBQUMsUUFBUSxDQUFDLHlCQUF5QixDQUFDLENBQUM7YUFDckQ7U0FDSjtJQUVMLENBQUM7Q0FFSjtBQTVCRCx3QkE0QkMifQ==