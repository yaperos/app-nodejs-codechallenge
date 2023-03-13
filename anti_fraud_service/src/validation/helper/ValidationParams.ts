const ValidationParams = {
    MAX_TRANSACTION_VALUE: 1000,
} as const;

type ValidationParamsType =
    (typeof ValidationParams)[keyof typeof ValidationParams];

export { type ValidationParamsType, ValidationParams };
