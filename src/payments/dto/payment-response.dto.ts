export class PaymentResponseDto {
  paymentId: string;
  status: 'pending' | 'settled' | 'failed';
  fraudStatus?: 'pending' | 'succeeded' | 'failed';
  ledgerStatus?: 'pending' | 'succeeded' | 'failed';
  failureReason?: string | null;
  updatedAt: string;
}
