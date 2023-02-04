export type ResultType = 'approved' | 'rejected';

export class EvaluationResultDto {
  readonly transactionExternalId: string;
  readonly result: ResultType;
}
