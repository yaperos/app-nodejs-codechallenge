import { Given, Then, When } from '@cucumber/cucumber';
import * as assert from 'assert';
import * as request from 'supertest';

import { application } from './hooks.steps';

export let httpServer: any;
export let _request: request.Test;
export let _response: request.Response;

Given('the application running', () => {
  httpServer = application.getHttpServer();
});

When('I send a GET request to {string}', (route: string) => {
  _request = request(httpServer).get(route);
});

Then('the response status code should be {int}', async (status: number) => {
  _response = await _request.expect(status);
});

Then('the response should be empty', () => {
  assert.deepEqual(_response.body, {});
});
