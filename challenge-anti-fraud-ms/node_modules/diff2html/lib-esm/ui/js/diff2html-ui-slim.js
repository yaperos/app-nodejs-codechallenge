import { hljs } from './highlight.js-slim';
import { Diff2HtmlUI as Diff2HtmlUIBase, defaultDiff2HtmlUIConfig } from './diff2html-ui-base';
export class Diff2HtmlUI extends Diff2HtmlUIBase {
    constructor(target, diffInput, config = {}) {
        super(target, diffInput, config, hljs);
    }
}
export { defaultDiff2HtmlUIConfig };
//# sourceMappingURL=diff2html-ui-slim.js.map