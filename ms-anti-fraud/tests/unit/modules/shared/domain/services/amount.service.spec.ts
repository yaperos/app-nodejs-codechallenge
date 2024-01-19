import { AmountService } from 'src/modules/shared/domain/services/amount.service';

describe('AmountService test', () => {
  const amountService: AmountService = new AmountService();

  it('should test isValid function', async () => {
    expect(amountService.isValid(1000)).toBeTruthy();
    expect(amountService.isValid(1001)).toBeFalsy();
  });
});
