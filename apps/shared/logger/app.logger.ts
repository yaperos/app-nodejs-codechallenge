import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppLogger extends Logger {
    logTransaction(transactionId: string, action: string, data?: any) {
        this.log(`[TRANSACTION:${transactionId}] ${action}`, JSON.stringify(data));
    }

    logFraudEvaluation(transactionId: string, result: string, value: number) {
        this.log(`[FRAUD:${transactionId}] Evaluation result: ${result} for value: ${value}`);
    }

    logKafkaEvent(topic: string, action: string, data?: any) {
        this.log(`[KAFKA:${topic}] ${action}`, JSON.stringify(data));
    }

    logError(context: string, error: Error, metadata?: any) {
        this.error(`[ERROR:${context}] ${error.message}`, error.stack, JSON.stringify(metadata));
    }
}
