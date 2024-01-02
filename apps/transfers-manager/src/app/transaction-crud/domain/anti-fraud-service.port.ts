import { AntiFraudServiceCommand } from "./anti-fraud-service.command";

export interface AntiFraudServicePort {
    triggerAntiFraudService(command: AntiFraudServiceCommand);
}
export const ANTI_FRAUD_SERVICE_PORT_TOKEN = "ANTI_FRAUD_SERVICE_PORT_TOKEN";