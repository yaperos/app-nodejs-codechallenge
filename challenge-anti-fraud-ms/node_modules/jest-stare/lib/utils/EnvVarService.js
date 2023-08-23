"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvVarService = void 0;
class EnvVarService {
    constructor(mPrefix) {
        this.mPrefix = mPrefix;
    }
    readEnvValue(suffix) {
        return process.env[this.mPrefix + suffix];
    }
    readBoolEnvValue(suffix) {
        const value = this.readEnvValue(suffix);
        if (value == null) {
            return undefined;
        }
        if ((value).toUpperCase() === "TRUE" || (value === "1")) {
            return true;
        }
        else if ((value).toUpperCase() === "FALSE" || (value === "0")) {
            return false;
        }
        else {
            return undefined;
        }
    }
}
exports.EnvVarService = EnvVarService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW52VmFyU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9FbnZWYXJTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUtBLE1BQWEsYUFBYTtJQU90QixZQUFvQixPQUFlO1FBQWYsWUFBTyxHQUFQLE9BQU8sQ0FBUTtJQUFHLENBQUM7SUFTaEMsWUFBWSxDQUFDLE1BQWM7UUFDOUIsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQVNNLGdCQUFnQixDQUFDLE1BQWM7UUFDbEMsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUN4QyxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7WUFDZixPQUFPLFNBQVMsQ0FBQztTQUNwQjtRQUNELElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxNQUFNLElBQUksQ0FBQyxLQUFLLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDckQsT0FBTyxJQUFJLENBQUM7U0FDZjthQUFNLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxXQUFXLEVBQUUsS0FBSyxPQUFPLElBQUksQ0FBQyxLQUFLLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDN0QsT0FBTyxLQUFLLENBQUM7U0FDaEI7YUFBTTtZQUNILE9BQU8sU0FBUyxDQUFDO1NBQ3BCO0lBQ0wsQ0FBQztDQUNKO0FBeENELHNDQXdDQyJ9