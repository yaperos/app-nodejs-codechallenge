export class CreateTransactionRequestDto {
  constructor(
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly value: number,
    public readonly transferTypeId: number,
  ) {}
}
