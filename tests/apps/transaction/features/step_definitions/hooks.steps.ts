/* eslint-disable @typescript-eslint/no-misused-promises */
import { AfterAll, BeforeAll } from 'cucumber';

import { TransationApp } from '../../../../../src/apps/transaction/TransationApp';

let application: TransationApp;

BeforeAll(async () => {
	application = new TransationApp();
	await application.start();
});

AfterAll(async () => {
	await application.stop();
});

export { application };
