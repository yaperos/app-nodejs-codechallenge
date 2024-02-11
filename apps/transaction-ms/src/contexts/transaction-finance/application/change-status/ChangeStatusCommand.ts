export class ChangeStatusCommand {
  constructor(
    public readonly accountExternalId: string,
    public readonly transactionStatus: string,
  ) {}
}
