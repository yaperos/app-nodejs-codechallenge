"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
/**
 * creates valid javascript identifiers from strings with dashes in them
 * '/home/user/project/my-icon-kappa.svg' => SvgMyIconKappa
 * 'my.icon.kappa' => MyIconKappa
 * 'my icon kappa' => MyIconKappa
 * @param str {string} a string with dashes in it
 * @returns {string} camelcased with non-word characters removed
 */
function escapeFileName(str) {
    return `svg-${path_1.default.basename(str, '.svg')}`
        .split(/\W+/)
        .map(x => `${x.charAt(0).toUpperCase()}${x.slice(1)}`)
        .join('');
}
exports.default = escapeFileName;
