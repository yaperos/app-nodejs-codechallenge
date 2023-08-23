import { AggregatedResult, AssertionResult } from "@jest/test-result";
export declare class TestSuite {
    static readonly JOIN_CHAR = ".";
    static create(results: AggregatedResult): HTMLElement[];
    static asignStatus(testStatusClass: string, result: AssertionResult, testSectionStatus: Map<string, string>): string;
    private static getStatusClassFromJestStatus;
    private static mixStatus;
    private static buildAccordionCard;
    private static buildAccordionCardHeader;
    private static buildAccordionCardBody;
    private static sanitizeFilePath;
}
