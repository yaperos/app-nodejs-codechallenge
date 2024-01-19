export class AmountService {
  static readonly MAX_VALID_VALUE = 1000;

  public isValid(value: number) {
    return value <= AmountService.MAX_VALID_VALUE;
  }
}
