import request from 'supertest';
import app from '../../config/app';

describe('Body Parser middleware', () => {
	test('Should parse body as json', async () => {
		app.post('/test_body_parser', (request, response) => {
			response.send(request.body);
		});

		const httpResponse = await request(app)
			.post('/test_body_parser')
			.send({ name: 'test' });

		expect(httpResponse.body).toEqual({ name: 'test' });
	});
});
