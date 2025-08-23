
export enum VALIDATION_ANTI_FRAUD_STATUS {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}


export const ERROR_GENERAL = {
    ERROR_500: {
        CODE: 500,
        TITLE: 'Error server',
    },
    ERROR_400: {
        CODE: 400,
        TITLE: 'Resource not found'
    },
    ERROR_404: {
        CODE: 404,
        TITLE: 'Validation failed',
    },
}