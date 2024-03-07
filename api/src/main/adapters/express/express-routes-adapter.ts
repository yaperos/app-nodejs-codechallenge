import { IController, HttpRequest } from '@presentation/protocols';
import { Request, Response } from 'express';

export const adapterRoute = (controller: IController) => {
	return async (request: Request, response: Response) => {
		const httpRequest: HttpRequest = {
			body: request.body,
			headers: request.headers
		};

		const httpResponse = await controller.handle(httpRequest);

		if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
			return response.status(httpResponse.statusCode).json(httpResponse.body);
		} else {
			return response.status(httpResponse.statusCode).json({
				error: httpResponse.body?.message
			});
		}
	};
};
