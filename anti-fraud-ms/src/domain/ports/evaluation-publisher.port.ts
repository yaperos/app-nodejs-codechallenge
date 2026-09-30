import type { FraudEvaluation } from '../models/fraud-evaluation';

export abstract class EvaluationPublisherPort {
    abstract publish(evaluation: FraudEvaluation): Promise<void>;
}