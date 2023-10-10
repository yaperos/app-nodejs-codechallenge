import { AfterAll, BeforeAll } from 'cucumber';

import { TransactionApp } from '../../../../../src/apps/transaction/transactionApp';

let application: TransactionApp;

BeforeAll(async () => {
	application = new TransactionApp();
	await application.start();
});

AfterAll(async () => {
	await application.stop();
});

export { application };
