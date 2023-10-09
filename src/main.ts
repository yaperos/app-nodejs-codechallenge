import { AntiFraudApp } from "./antiFraudApp";
import { TransactionApp } from "./transactionApp";

const transactionApp = new TransactionApp();
transactionApp.run();

const antiFraudApp = new AntiFraudApp();
antiFraudApp.run();