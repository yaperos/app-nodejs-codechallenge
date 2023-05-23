import { service } from "../service/index";
import { TransactionsController } from "./transactions-controller";

export const controller = new TransactionsController({
  service: service,
});
