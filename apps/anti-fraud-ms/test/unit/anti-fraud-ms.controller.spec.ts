import { firstValueFrom, of } from 'rxjs';
import { AntiFraudMsController } from '../../src/anti-fraud-ms.controller';
import { AntiFraudMsService } from '../../src/anti-fraud-ms.service';
import { TestBed } from '@automock/jest';

describe('AntiFraudMsController Unit Test', () => {
  let antiFraudMsController: AntiFraudMsController;
  let antiFraudMsService: jest.Mocked<AntiFraudMsService>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(AntiFraudMsController).compile();
    antiFraudMsController = unit;
    antiFraudMsService = unitRef.get(AntiFraudMsService);
  });

  test('should return approved status', async () => {
    await antiFraudMsService.validate.mockImplementation(() =>
      of(
        '{accountExternalId: "77859261-a72c-4331-833b-7a1af54375da", transactionStatus: "APPROVED"}',
      ),
    );
    const result = await antiFraudMsController.handleTransactionValidate(
      '{accountExternalId: "77859261-a72c-4331-833b-7a1af54375da", value: 1000}',
    );

    expect(antiFraudMsService.validate).toHaveBeenCalled();
    expect(await firstValueFrom(result)).toEqual(
      '{accountExternalId: "77859261-a72c-4331-833b-7a1af54375da", transactionStatus: "APPROVED"}',
    );
  });

  test('should return reject status', async () => {
    await antiFraudMsService.validate.mockImplementation(() =>
      of(
        '{accountExternalId: "77859261-a72c-4331-833b-7a1af54375da", transactionStatus: "REJECT"}',
      ),
    );
    const result = await antiFraudMsController.handleTransactionValidate(
      '{accountExternalId: "77859261-a72c-4331-833b-7a1af54375da", value: 1000}',
    );

    expect(antiFraudMsService.validate).toHaveBeenCalled();
    expect(await firstValueFrom(result)).toEqual(
      '{accountExternalId: "77859261-a72c-4331-833b-7a1af54375da", transactionStatus: "REJECT"}',
    );
  });
});
