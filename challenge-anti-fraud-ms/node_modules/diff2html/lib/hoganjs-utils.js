"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Hogan = __importStar(require("hogan.js"));
const diff2html_templates_1 = require("./diff2html-templates");
class HoganJsUtils {
    constructor({ compiledTemplates = {}, rawTemplates = {} }) {
        const compiledRawTemplates = Object.entries(rawTemplates).reduce((previousTemplates, [name, templateString]) => {
            const compiledTemplate = Hogan.compile(templateString, { asString: false });
            return Object.assign(Object.assign({}, previousTemplates), { [name]: compiledTemplate });
        }, {});
        this.preCompiledTemplates = Object.assign(Object.assign(Object.assign({}, diff2html_templates_1.defaultTemplates), compiledTemplates), compiledRawTemplates);
    }
    static compile(templateString) {
        return Hogan.compile(templateString, { asString: false });
    }
    render(namespace, view, params, partials, indent) {
        const templateKey = this.templateKey(namespace, view);
        try {
            const template = this.preCompiledTemplates[templateKey];
            return template.render(params, partials, indent);
        }
        catch (e) {
            throw new Error(`Could not find template to render '${templateKey}'`);
        }
    }
    template(namespace, view) {
        return this.preCompiledTemplates[this.templateKey(namespace, view)];
    }
    templateKey(namespace, view) {
        return `${namespace}-${view}`;
    }
}
exports.default = HoganJsUtils;
//# sourceMappingURL=hoganjs-utils.js.map