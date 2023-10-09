import { AntiFraudApp } from "./antiFraudApp";
import { TransactionApp } from "./transactionApp";

const transactionApp = new TransactionApp();
const antiFraudApp = new AntiFraudApp();

transactionApp.run();
antiFraudApp.run();