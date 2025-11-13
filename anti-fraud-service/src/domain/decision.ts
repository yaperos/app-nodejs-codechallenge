export type FraudStatus = 'approved' | 'rejected';

export interface EvaluateTransactionInput {
  value: number;
}

export interface EvaluationResult {
  status: FraudStatus;
  reason: string | null;
}

export const approveOrReject = (
  input: EvaluateTransactionInput,
): EvaluationResult => {
  if (input.value > 1000) {
    return {
      status: 'rejected',
      reason: 'Value exceeds threshold of 1000',
    };
  }

  return {
    status: 'approved',
    reason: null,
  };
};
