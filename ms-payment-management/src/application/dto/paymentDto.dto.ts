export class PaymentDto {
    id?: string;
    email: string;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    tranferTypeId: number;
    value: number;
    status?: 'pending' | 'approved' | 'rejected';
}