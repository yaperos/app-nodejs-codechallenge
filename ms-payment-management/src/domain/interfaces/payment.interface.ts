export interface PaymentInterface {
    id: string;
    userId: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
}
