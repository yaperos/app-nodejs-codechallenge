export interface CreateTransferResponse {
    error?: any
    transfer?: any
}

export interface SearchTransfersResponse {
    error?: any
    transfers?: any[]
    pagination?: any
    //hasMore?: boolean
}

export interface DeleteTransferResponse {
    error?: any
    transfer?: any
}
