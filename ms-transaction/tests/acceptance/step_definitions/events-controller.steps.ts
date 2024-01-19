import { Then } from '@cucumber/cucumber';

import { sleep } from './hooks.steps';

Then('the application should consume and process the event', async () => {
  await sleep(500);
});
