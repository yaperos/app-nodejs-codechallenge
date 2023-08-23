"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entry = void 0;
const Reporter_1 = require("./reporter/Reporter");
const Processor_1 = require("./processor/Processor");
function entry(parm0, parm1) {
    if (this instanceof entry) {
        return new Reporter_1.Reporter(parm0, parm1);
    }
    else {
        return Processor_1.Processor.run(parm0, parm1);
    }
}
exports.entry = entry;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW50cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvZW50cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsa0RBQStDO0FBQy9DLHFEQUFrRDtBQVNsRCxTQUFnQixLQUFLLENBQUMsS0FBVSxFQUFFLEtBQVc7SUFHekMsSUFBSSxJQUFJLFlBQVksS0FBSyxFQUFFO1FBQ3ZCLE9BQU8sSUFBSSxtQkFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztLQUdyQztTQUFNO1FBQ0gsT0FBTyxxQkFBUyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7S0FDdEM7QUFDTCxDQUFDO0FBVkQsc0JBVUMifQ==