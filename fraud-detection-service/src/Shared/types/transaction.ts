export type Transaction = {
    uuid : string,
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number; 
    status?: 'pending' | 'approved' | 'rejected';
    id?: '',
};