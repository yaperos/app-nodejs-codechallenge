import { Diff2HtmlConfig } from '../../diff2html';
import { DiffFile } from '../../types';
import { HLJSApi } from 'highlight.js';
export interface Diff2HtmlUIConfig extends Diff2HtmlConfig {
    synchronisedScroll?: boolean;
    highlight?: boolean;
    fileListToggle?: boolean;
    fileListStartVisible?: boolean;
    highlightLanguages?: Map<string, string>;
    smartSelection?: boolean;
    fileContentToggle?: boolean;
    stickyFileHeaders?: boolean;
}
export declare const defaultDiff2HtmlUIConfig: {
    synchronisedScroll: boolean;
    highlight: boolean;
    fileListToggle: boolean;
    fileListStartVisible: boolean;
    highlightLanguages: Map<string, string>;
    smartSelection: boolean;
    fileContentToggle: boolean;
    stickyFileHeaders: boolean;
    outputFormat: import("../../types").OutputFormatType;
    drawFileList: boolean;
    renderNothingWhenEmpty: boolean;
    matchingMaxComparisons: number;
    maxLineSizeInBlockForComparison: number;
    matching: import("../../types").LineMatchingType;
    matchWordsThreshold: number;
    maxLineLengthHighlight: number;
    diffStyle: import("../../types").DiffStyleType;
};
export declare class Diff2HtmlUI {
    readonly config: typeof defaultDiff2HtmlUIConfig;
    readonly diffHtml: string;
    readonly targetElement: HTMLElement;
    readonly hljs: HLJSApi | null;
    currentSelectionColumnId: number;
    constructor(target: HTMLElement, diffInput?: string | DiffFile[], config?: Diff2HtmlUIConfig, hljs?: HLJSApi);
    draw(): void;
    synchronisedScroll(): void;
    fileListToggle(startVisible: boolean): void;
    fileContentToggle(): void;
    highlightCode(): void;
    stickyFileHeaders(): void;
    smartSelection(): void;
    private getHashTag;
    private isElement;
}
//# sourceMappingURL=diff2html-ui-base.d.ts.map