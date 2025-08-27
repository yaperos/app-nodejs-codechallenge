export class NewPaymentnDto {
    id: string;
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
}