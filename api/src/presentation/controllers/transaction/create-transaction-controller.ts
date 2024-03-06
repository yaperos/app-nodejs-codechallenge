import { IAddTransactionUseCase } from '@domain/usecases/add-transaction-use-case';
import { badRequest, noContent } from '@presentation/helpers/http/http-helper';
import {
	IController,
	IValidation,
	HttpRequest,
	HttpResponse
} from '@presentation/protocols';

export class CreateTransactionController implements IController {
	constructor(
		private readonly validator: IValidation,
		private readonly useCase: IAddTransactionUseCase
	) {}

	async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
		const requestOk = this.validator.validate(httpRequest.body);

		if (requestOk.isLeft()) {
			return badRequest(requestOk.value);
		}

		const result = await this.useCase.execute(httpRequest.body);

		if (result.isLeft()) {
			return badRequest(result.value);
		}

		return noContent();
	}
}
