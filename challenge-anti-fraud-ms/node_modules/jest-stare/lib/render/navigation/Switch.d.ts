/// <reference types="jquery" />
/// <reference types="jquery" />
export declare class Switch {
    static readonly JOIN_CHAR = "\\.";
    private static mixStatus;
    constructor(checkBox: JQuery<HTMLInputElement>, divClass: JQuery<HTMLDivElement>, divClassName?: string, addtnlCheckBoxArray?: JQuery<HTMLInputElement>[], addtnlClassNameArray?: string[]);
    private activateFilters;
}
