export interface Transaction {
    id: string
    stateId: number
    accountExternalIdDebit: string
    accountExternalIdCredit: string
    tranferTypeId: number
    value: number
}