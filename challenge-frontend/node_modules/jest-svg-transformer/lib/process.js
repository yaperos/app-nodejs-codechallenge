"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const escape_file_name_1 = __importDefault(require("./escape-file-name"));
/**
 * custom jest transformer https://facebook.github.io/jest/docs/en/configuration.html#transform-object-string-string
 * e.x. ('<svg>some stuff</svg>', '.../my-icon.svg') => function MyIcon(props) { return <svg {...props}/>; }
 * this is useful for rendering snapshots because it will appear as <SvgMyIcon /> in the .snap
 * @param src {string} full text of the file being read
 * @param filePath {string} full path to the file
 * @returns {string} the transformed svg file
 */
function process(src, filePath) {
    if (path_1.default.extname(filePath) === '.svg') {
        const name = escape_file_name_1.default(filePath);
        return `
const React = require('react');
function ${name}(props) {
  return React.createElement(
    'svg', 
    Object.assign({}, props, {'data-file-name': ${name}.name})
  );
}
module.exports = ${name};
            `;
    }
    else {
        return src;
    }
}
exports.default = process;
