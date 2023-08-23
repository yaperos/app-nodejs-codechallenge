import { HighlightResult } from 'highlight.js';
declare type NodeEvent = {
    event: 'start' | 'stop';
    offset: number;
    node: Node;
};
export declare function nodeStream(node: Node): NodeEvent[];
export declare function mergeStreams(original: NodeEvent[], highlighted: NodeEvent[], value: string): string;
export declare function closeTags(res: HighlightResult): HighlightResult;
export declare function getLanguage(fileExtension: string): string;
export {};
//# sourceMappingURL=highlight.js-helpers.d.ts.map