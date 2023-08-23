"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultDiff2HtmlUIConfig = exports.Diff2HtmlUI = void 0;
const highlight_js_slim_1 = require("./highlight.js-slim");
const diff2html_ui_base_1 = require("./diff2html-ui-base");
Object.defineProperty(exports, "defaultDiff2HtmlUIConfig", { enumerable: true, get: function () { return diff2html_ui_base_1.defaultDiff2HtmlUIConfig; } });
class Diff2HtmlUI extends diff2html_ui_base_1.Diff2HtmlUI {
    constructor(target, diffInput, config = {}) {
        super(target, diffInput, config, highlight_js_slim_1.hljs);
    }
}
exports.Diff2HtmlUI = Diff2HtmlUI;
//# sourceMappingURL=diff2html-ui-slim.js.map