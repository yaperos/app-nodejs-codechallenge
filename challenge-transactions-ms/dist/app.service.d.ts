export declare class AppService {
    getHello(): string;
    static get environment(): string;
    static get stage(): string;
    static get port(): number;
    static get EVENT_BRIDGE_APPOINTMENTS_CONFIG(): EventBridgeConfig;
    onFailedToConnectToDatabase(error: Error): Promise<void>;
}
export declare class EventBridgeConfig {
    readonly source: string;
    readonly detailType: string;
    readonly eventBusName: string;
    readonly region: string;
}
