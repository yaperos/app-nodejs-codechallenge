import request from 'supertest';
import app from '../../config/app';

describe('Content Type middleware', () => {
	test('Should return default content type as json', async () => {
		app.get('/test_content_type', (request, response) => {
			response.send();
		});

		const contentType = await request(app).get('/test_content_type');

		expect(contentType.header['content-type']).toContain('application/json');
	});

	test('Should return xml content type when forced', async () => {
		app.get('/test_content_type_xml', (request, response) => {
			response.type('xml');
			response.send();
		});

		const contentType = await request(app).get('/test_content_type_xml');

		expect(contentType.header['content-type']).toContain('application/xml');
	});
});
