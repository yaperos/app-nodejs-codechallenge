export declare class EnvVarService {
    private mPrefix;
    constructor(mPrefix: string);
    readEnvValue(suffix: string): string;
    readBoolEnvValue(suffix: string): boolean;
}
