import { UUID } from "crypto";

export interface NotifyStatusChangedPort {
    notifyStatusChanged(event: string, transferData: { transactionId: UUID });
}

export const NOTIFY_STATUS_CHANGED_PORT_TOKEN = "NOTIFY_STATUS_CHANGED_PORT_TOKEN";