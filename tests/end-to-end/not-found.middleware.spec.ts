import request from 'supertest';
import app from '../../src/index';

// Only for exercise purpose, it should be deeper
describe("E2E test: Not found middleware on API", () => {
  it("should fail then try to access a unknow route", async () => {
    const response = await request(app).get('/fake');
    expect(response.statusCode).toBe(404);
  });
});