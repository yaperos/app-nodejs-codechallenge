export class DepositCommand {
  constructor(
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly tranferTypeId: number,
    public readonly value: number,
  ) {}
}
