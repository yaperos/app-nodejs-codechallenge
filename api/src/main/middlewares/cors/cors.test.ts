import request from 'supertest';
import app from '../../config/app';

describe('Cors middleware', () => {
	test('Should enable cors', async () => {
		app.get('/test_cors', (request, response) => {
			response.send();
		});

		const httpResponse = await request(app).get('/test_cors');

		expect(httpResponse.header['access-control-allow-headers']).toEqual('*');
		expect(httpResponse.header['access-control-allow-methods']).toEqual('*');
		expect(httpResponse.header['access-control-allow-headers']).toEqual('*');
	});
});
