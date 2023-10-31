export default interface ITransactionEvent {
  transaction_external_id: string
  value: number
  transaction_status?: string
}
