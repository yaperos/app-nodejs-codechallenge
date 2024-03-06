import { HttpRequest, HttpResponse } from './http';

export interface IController {
	handle(httpRequest: HttpRequest): Promise<HttpResponse>;
}
