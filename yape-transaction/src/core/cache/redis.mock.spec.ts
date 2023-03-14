export class RedisCacheMock {
  set = jest.fn().mockReturnThis();

  get = jest.fn().mockReturnThis();

  saveTransaction = jest.fn().mockReturnThis();

  getTransaction = jest.fn().mockReturnThis();
}
