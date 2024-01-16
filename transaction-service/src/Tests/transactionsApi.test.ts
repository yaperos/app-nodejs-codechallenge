import request from 'supertest';

describe('GET /', () => {
    it('should return Transaction-Service', async () => {
      const response = await request('http://localhost:4001').get('/');
      expect(response.text).toBe('Transaction-Service');
      expect(response.statusCode).toBe(200);
    });
});

describe('GET /health', () => {
    it('should return status up', async () => {
      const response = await request('http://localhost:4001').get('/health');
      expect(response.body).toEqual({ status: 'up' });
      expect(response.statusCode).toBe(200);
    });
});

  
  