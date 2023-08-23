import * as Hogan from 'hogan.js';
import { defaultTemplates } from './diff2html-templates';
export default class HoganJsUtils {
    constructor({ compiledTemplates = {}, rawTemplates = {} }) {
        const compiledRawTemplates = Object.entries(rawTemplates).reduce((previousTemplates, [name, templateString]) => {
            const compiledTemplate = Hogan.compile(templateString, { asString: false });
            return Object.assign(Object.assign({}, previousTemplates), { [name]: compiledTemplate });
        }, {});
        this.preCompiledTemplates = Object.assign(Object.assign(Object.assign({}, defaultTemplates), compiledTemplates), compiledRawTemplates);
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
//# sourceMappingURL=hoganjs-utils.js.map