"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IO = void 0;
const fs = require("fs");
const path = require("path");
const pkgUp = require("pkg-up");
class IO {
    static unlinkSync(file) {
        if (IO.existsSync(file)) {
            fs.unlinkSync(file);
        }
    }
    static writeFile(wpath, data) {
        return new Promise((resolve, reject) => {
            fs.writeFile(wpath, data, (error) => {
                if (error) {
                    reject(error);
                }
                resolve();
            });
        });
    }
    static writeFileSync(wpath, data) {
        fs.writeFileSync(wpath, data);
    }
    static mkDirSync(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
    }
    static mkdirsSync(dir) {
        const dirs = path.resolve(dir).replace(/\\/g, "/").split("/");
        let createDir = "";
        for (const crDir of dirs) {
            createDir += (crDir + "/");
            IO.mkDirSync(createDir);
        }
    }
    static readFileSync(wpath) {
        return fs.readFileSync(wpath).toString();
    }
    static existsSync(wpath) {
        return fs.existsSync(wpath);
    }
    static readPackageJson() {
        const packageJson = pkgUp.sync();
        if (packageJson !== null) {
            return JSON.parse(IO.readFileSync(packageJson));
        }
        else {
            return {};
        }
    }
    static copyFileSync(src, dest) {
        fs.copyFileSync(src, dest);
    }
}
exports.IO = IO;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSU8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvSU8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseUJBQXlCO0FBQ3pCLDZCQUE2QjtBQUU3QixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFPaEMsTUFBYSxFQUFFO0lBUUosTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFZO1FBQ2pDLElBQUksRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUNyQixFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3ZCO0lBQ0wsQ0FBQztJQVVNLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBYSxFQUFFLElBQVM7UUFDNUMsT0FBTyxJQUFJLE9BQU8sQ0FBTyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUN6QyxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUUsRUFBRTtnQkFDaEMsSUFBSSxLQUFLLEVBQUU7b0JBQ1AsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUNqQjtnQkFDRCxPQUFPLEVBQUUsQ0FBQztZQUNkLENBQUMsQ0FBQyxDQUFDO1FBQ1AsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBVU0sTUFBTSxDQUFDLGFBQWEsQ0FBQyxLQUFhLEVBQUUsSUFBUztRQUNoRCxFQUFFLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBT00sTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFXO1FBQy9CLElBQUksQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3JCLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDckI7SUFDTCxDQUFDO0lBUU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFXO1FBSWhDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFOUQsSUFBSSxTQUFTLEdBQVcsRUFBRSxDQUFDO1FBQzNCLEtBQUssTUFBTSxLQUFLLElBQUksSUFBSSxFQUFFO1lBRXRCLFNBQVMsSUFBSSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQztZQUMzQixFQUFFLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQzNCO0lBQ0wsQ0FBQztJQVNNLE1BQU0sQ0FBQyxZQUFZLENBQUMsS0FBYTtRQUNwQyxPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDN0MsQ0FBQztJQVNNLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBYTtRQUNsQyxPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQVNNLE1BQU0sQ0FBQyxlQUFlO1FBQ3pCLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNqQyxJQUFJLFdBQVcsS0FBSyxJQUFJLEVBQUU7WUFDdEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxZQUFZLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztTQUNuRDthQUFNO1lBRUgsT0FBTyxFQUFFLENBQUM7U0FDYjtJQUNMLENBQUM7SUFRTSxNQUFNLENBQUMsWUFBWSxDQUFDLEdBQWdCLEVBQUUsSUFBaUI7UUFDMUQsRUFBRSxDQUFDLFlBQVksQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDL0IsQ0FBQztDQUNKO0FBNUhELGdCQTRIQyJ9