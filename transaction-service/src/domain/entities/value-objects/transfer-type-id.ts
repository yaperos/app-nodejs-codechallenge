export class TransferTypeId {
  public readonly value: number;

  constructor(value: number) {
    this.value = value;
  }

  public get name(): string {
    if (this.value == 1) {
      return "add";
    }

    if (this.value == 2) {
      return "substract";
    }

    return "other";
  }
}
