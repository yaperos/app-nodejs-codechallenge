import { INestApplication } from '@nestjs/common';

import { Method } from '../actions/base-action';
import base from '../base';

describe('AppController test', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await base.getTestingApp();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should check health', async () => {
    const res = await base.requestApi({
      app,
      method: Method.GET,
      path: '/health',
    });
    base.expectOk(res);

    const body = res.body;
    expect(body).toEqual({});
  });
});
