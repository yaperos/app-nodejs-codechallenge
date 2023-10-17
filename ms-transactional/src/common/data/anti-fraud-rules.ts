import { AntiFraudRule } from 'src/transactions/domain/entity/anti-fraud-rule';

export const getAntiFraudRules = (): AntiFraudRule[] => {
  return [
    {
      description: 'Transaction amount is greater than 1000',
      riskLevel: 0.3,
      key: 'MAX_AMOUNT',
      value: '1000',
    },
    {
      description: 'Time between transactions is less than 30 seconds',
      riskLevel: 0.9,
      key: 'TIME_BETWEEN_TRANSACTIONS',
      value: '30',
    },
  ];
};
