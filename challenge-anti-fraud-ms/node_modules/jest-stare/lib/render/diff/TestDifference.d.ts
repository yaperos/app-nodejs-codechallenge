export declare class TestDifference {
    static DIFF_INDICATOR: RegExp;
    static DIFF_END_INDICATOR: RegExp;
    static containsDiff(jestFailureMessage: string): boolean;
    static generate(jestFailureMessage: string): HTMLElement;
    private static isolateDiff;
}
