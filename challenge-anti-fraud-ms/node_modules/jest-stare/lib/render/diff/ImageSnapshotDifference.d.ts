export declare class ImageSnapshotDifference {
    static DIFF_INDICATOR: string[];
    static DIFF_IMAGE: RegExp;
    static DIFF_DETAILS: RegExp;
    static containsDiff(jestFailureMessage: string): boolean;
    static generate(jestFailureMessage: string): HTMLElement;
    static parseDiffImagePath(jestFailureMessage: string): string;
    static parseDiffImageName(jestFailureMessage: string): string;
    private static parseDiffError;
}
