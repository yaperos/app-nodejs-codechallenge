export const fraudConfig = {
  evaluation: {
    rejectionThreshold: Number(process.env.FRAUD_REJECTION_THRESHOLD) || 1000,
    evaluationTimeout: Number(process.env.FRAUD_EVALUATION_TIMEOUT) || 5000,
  }
} as const;
