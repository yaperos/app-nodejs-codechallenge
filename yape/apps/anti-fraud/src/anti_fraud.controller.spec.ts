import { Anti_fraudController } from './anti_fraud.controller';
import * as mock from "../mock/input_anti_fraud.json"
import {TransactionStatus} from "../../common/enums/transaction-status";

describe('AntiFraudController', () => {
  let antiFraudController: Anti_fraudController = new Anti_fraudController();

  describe('root', () => {

    it.each(mock.REJECTED)("should return status REJECTED if value $value is greeter than 1000", async (input) => {

      expect(await antiFraudController.handleAntiFraud(input)).toBe(JSON.stringify({
        ...input,
        status: TransactionStatus.REJECTED
      }));
    })

    it.each(mock.APPROVED)("should return status APPROVED if value $value is lower or equal than 1000", async (input) => {

      expect(await antiFraudController.handleAntiFraud(input)).toBe(JSON.stringify({
        ...input,
        status: TransactionStatus.APPROVED
      }));

    })

  });
});
