"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Switch = void 0;
const util_1 = require("util");
class Switch {
    static mixStatus(currentStatus, oldStatus) {
        const statusArray = oldStatus.split(Switch.JOIN_CHAR);
        statusArray.push(currentStatus);
        const sortedUniqueStatusArray = [...new Set(statusArray)].sort();
        return sortedUniqueStatusArray.join(Switch.JOIN_CHAR);
    }
    constructor(checkBox, divClass, divClassName, addtnlCheckBoxArray, addtnlClassNameArray) {
        this.activateFilters(checkBox, divClass, divClassName, addtnlCheckBoxArray, addtnlClassNameArray);
    }
    activateFilters(checkBox, divClass, divClassName, addtnlCheckBoxArray, addtnlClassNameArray) {
        checkBox.change(() => {
            if (checkBox.is(":checked")) {
                divClass.show();
                if (!(0, util_1.isNullOrUndefined)(addtnlCheckBoxArray)) {
                    addtnlCheckBoxArray.forEach((addtnlCheckBox, index) => {
                        const mixedDualClass = Switch.mixStatus(addtnlClassNameArray[index], divClassName);
                        const mixedClassDiv = $("." + mixedDualClass);
                        mixedClassDiv.show();
                    });
                    const mixedClass = Switch.mixStatus(addtnlClassNameArray[0], divClassName);
                    const allMixedClass = Switch.mixStatus(addtnlClassNameArray[1], mixedClass);
                    const allMixedClassDiv = $("." + allMixedClass);
                    allMixedClassDiv.show();
                }
            }
            else {
                divClass.hide();
                if (!(0, util_1.isNullOrUndefined)(addtnlCheckBoxArray)) {
                    let allUnchecked = true;
                    addtnlCheckBoxArray.forEach((addtnlCheckBox, index) => {
                        if (!addtnlCheckBox.is(":checked")) {
                            const mixedClass = Switch.mixStatus(addtnlClassNameArray[index], divClassName);
                            const mixedClassDiv = $("." + mixedClass);
                            mixedClassDiv.hide();
                        }
                        else {
                            allUnchecked = false;
                        }
                    });
                    if (allUnchecked) {
                        const mixedClass = Switch.mixStatus(addtnlClassNameArray[0], divClassName);
                        const allMixedClass = Switch.mixStatus(addtnlClassNameArray[1], mixedClass);
                        const allMixedClassDiv = $("." + allMixedClass);
                        allMixedClassDiv.hide();
                    }
                }
            }
        });
    }
}
exports.Switch = Switch;
Switch.JOIN_CHAR = "\\.";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3dpdGNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL3JlbmRlci9uYXZpZ2F0aW9uL1N3aXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrQkFBeUM7QUFPekMsTUFBYSxNQUFNO0lBaUJQLE1BQU0sQ0FBQyxTQUFTLENBQUMsYUFBcUIsRUFBRSxTQUFpQjtRQUM3RCxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN0RCxXQUFXLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sdUJBQXVCLEdBQUcsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDakUsT0FBTyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFXRCxZQUNJLFFBQWtDLEVBQUUsUUFBZ0MsRUFBRSxZQUFxQixFQUMzRixtQkFBZ0QsRUFBRSxvQkFBK0I7UUFDN0UsSUFBSSxDQUFDLGVBQWUsQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLFlBQVksRUFBRSxtQkFBbUIsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDO0lBQzFHLENBQUM7SUFZTyxlQUFlLENBQ25CLFFBQWtDLEVBQUUsUUFBZ0MsRUFBRSxZQUFxQixFQUMzRixtQkFBZ0QsRUFBRSxvQkFBK0I7UUFDN0UsUUFBUSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUU7WUFDakIsSUFBSSxRQUFRLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFO2dCQUN6QixRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7Z0JBQ2hCLElBQUksQ0FBQyxJQUFBLHdCQUFpQixFQUFDLG1CQUFtQixDQUFDLEVBQUU7b0JBQ3pDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsRUFBRTt3QkFDbEQsTUFBTSxjQUFjLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQzt3QkFDbkYsTUFBTSxhQUFhLEdBQUcsQ0FBQyxDQUFDLEdBQUcsR0FBRyxjQUFjLENBQTJCLENBQUM7d0JBQ3hFLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztvQkFDekIsQ0FBQyxDQUFDLENBQUM7b0JBRUgsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQztvQkFDM0UsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztvQkFDNUUsTUFBTSxnQkFBZ0IsR0FBSSxDQUFDLENBQUMsR0FBRyxHQUFHLGFBQWEsQ0FBMkIsQ0FBQztvQkFDM0UsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUM7aUJBQzNCO2FBQ0o7aUJBQU07Z0JBQ0gsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNoQixJQUFJLENBQUMsSUFBQSx3QkFBaUIsRUFBQyxtQkFBbUIsQ0FBQyxFQUFFO29CQUN6QyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7b0JBQ3hCLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsRUFBRTt3QkFDbEQsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUU7NEJBQ2hDLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7NEJBQy9FLE1BQU0sYUFBYSxHQUFHLENBQUMsQ0FBQyxHQUFHLEdBQUcsVUFBVSxDQUEyQixDQUFDOzRCQUNwRSxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7eUJBQ3hCOzZCQUFNOzRCQUNILFlBQVksR0FBRyxLQUFLLENBQUM7eUJBQ3hCO29CQUNMLENBQUMsQ0FBQyxDQUFDO29CQUVILElBQUksWUFBWSxFQUFFO3dCQUNkLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLEVBQUUsWUFBWSxDQUFDLENBQUM7d0JBQzNFLE1BQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7d0JBQzVFLE1BQU0sZ0JBQWdCLEdBQUksQ0FBQyxDQUFDLEdBQUcsR0FBRyxhQUFhLENBQTJCLENBQUM7d0JBQzNFLGdCQUFnQixDQUFDLElBQUksRUFBRSxDQUFDO3FCQUMzQjtpQkFDSjthQUNKO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDOztBQTFGTCx3QkEyRkM7QUFwRjBCLGdCQUFTLEdBQUcsS0FBSyxDQUFDIn0=