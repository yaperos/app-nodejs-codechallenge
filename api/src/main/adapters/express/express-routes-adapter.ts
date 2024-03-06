import { IController, HttpRequest } from '@presentation/protocols';
import { Request, Response } from 'express';

export const adapterRoute = (controller: IController) => {
	return async (request: Request, response: Response) => {
		const httpRequest: HttpRequest = {
			body: request.body,
			headers: request.headers
		};

		try {
			const httpResponse = await controller.handle(httpRequest);

			if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
				return response.status(httpResponse.statusCode).json(httpResponse.body);
			} else {
				const errorBody = httpResponse.body ? httpResponse.body : undefined;
				return response.status(httpResponse.statusCode).json({
					error: httpResponse.body?.message,
					...errorBody
				});
			}
		} catch (error) {
			console.log(error);

			return response.status(500).json({
				error: 'Internal Server Error'
			});
		}
	};
};
