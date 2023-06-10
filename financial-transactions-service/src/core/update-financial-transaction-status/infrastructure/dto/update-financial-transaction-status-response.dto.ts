export class UpdateFinancialTransactionStatusResponseDTO {
  constructor(
    readonly accountExternalIdDebit: string,
    readonly wasUpdated: boolean,
  ) {}
}
