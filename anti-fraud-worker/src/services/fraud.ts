import Producer from "./producer";
import { 
    EStatus, 
    ETypeEventTransaction, 
    IPayloadBody, 
    IPayloadCall 
} from "../types";
import logger from "../logger";

export default class Fraud {
    readonly producer;

    constructor(producer: Producer) {
        this.producer = producer;
    }

    async handler(payload: IPayloadBody) {
        const { value, id } = payload;
        const payloadApproved = {
            payload: {
                status: EStatus.APPROVED, 
                id
            },
            event: ETypeEventTransaction.EVENT_TRANSACTION_APPROVED
        }
        
        const payloadReject = {
            payload: {
                status: EStatus.REJECTED, 
                id
            },
            event: ETypeEventTransaction.EVENT_TRANSACTION_REJECTED
        }

        const process = value > 1000 ? payloadReject : payloadApproved
        
        await this.call(process)
        
    }

    async call(payload:IPayloadCall) {
        const { event, payload:body } = payload;
        
        await this.producer.call(body, event);

        logger.info(`[EXECUTED] ${event}`)
    }
}
