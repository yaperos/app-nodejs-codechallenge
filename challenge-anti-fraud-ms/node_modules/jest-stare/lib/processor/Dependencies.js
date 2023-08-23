"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dependencies = void 0;
const Constants_1 = require("./Constants");
class Dependencies {
}
exports.Dependencies = Dependencies;
Dependencies.THIRD_PARTY_DEPENDENCIES = [
    {
        requireDir: "bootstrap/dist/js/",
        file: "bootstrap.min.js",
        targetDir: Constants_1.Constants.JS_DIR
    },
    {
        requireDir: "diff2html/bundles/js/",
        file: "diff2html.min.js",
        targetDir: Constants_1.Constants.JS_DIR
    },
    {
        requireDir: "jquery/dist/",
        file: "jquery.min.js",
        targetDir: Constants_1.Constants.JS_DIR
    },
    {
        requireDir: "holderjs/",
        file: "holder.js",
        targetDir: Constants_1.Constants.JS_DIR
    },
    {
        requireDir: "bootstrap/dist/css/",
        file: "bootstrap.min.css",
        targetDir: Constants_1.Constants.CSS_DIR
    },
    {
        requireDir: "diff2html/bundles/css/",
        file: "diff2html.min.css",
        targetDir: Constants_1.Constants.CSS_DIR
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRGVwZW5kZW5jaWVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3Byb2Nlc3Nvci9EZXBlbmRlbmNpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMkNBQXdDO0FBT3hDLE1BQWEsWUFBWTs7QUFBekIsb0NBNENDO0FBcEMwQixxQ0FBd0IsR0FBNEI7SUFHdkU7UUFDSSxVQUFVLEVBQUUsb0JBQW9CO1FBQ2hDLElBQUksRUFBRSxrQkFBa0I7UUFDeEIsU0FBUyxFQUFFLHFCQUFTLENBQUMsTUFBTTtLQUM5QjtJQUNEO1FBQ0ksVUFBVSxFQUFFLHVCQUF1QjtRQUNuQyxJQUFJLEVBQUUsa0JBQWtCO1FBQ3hCLFNBQVMsRUFBRSxxQkFBUyxDQUFDLE1BQU07S0FDOUI7SUFDRDtRQUNJLFVBQVUsRUFBRSxjQUFjO1FBQzFCLElBQUksRUFBRSxlQUFlO1FBQ3JCLFNBQVMsRUFBRSxxQkFBUyxDQUFDLE1BQU07S0FDOUI7SUFDRDtRQUNJLFVBQVUsRUFBRSxXQUFXO1FBQ3ZCLElBQUksRUFBRSxXQUFXO1FBQ2pCLFNBQVMsRUFBRSxxQkFBUyxDQUFDLE1BQU07S0FDOUI7SUFHRDtRQUNJLFVBQVUsRUFBRSxxQkFBcUI7UUFDakMsSUFBSSxFQUFFLG1CQUFtQjtRQUN6QixTQUFTLEVBQUUscUJBQVMsQ0FBQyxPQUFPO0tBQy9CO0lBQ0Q7UUFDSSxVQUFVLEVBQUUsd0JBQXdCO1FBQ3BDLElBQUksRUFBRSxtQkFBbUI7UUFDekIsU0FBUyxFQUFFLHFCQUFTLENBQUMsT0FBTztLQUMvQjtDQUNKLENBQUMifQ==