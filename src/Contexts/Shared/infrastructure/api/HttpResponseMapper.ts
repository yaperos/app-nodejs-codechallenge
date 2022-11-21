import { UseCaseResponse } from 'Contexts/Shared/domain/UseCaseResponse';
import { HttpResponseBody } from '../../domain/HttpResponse';

export class HttpResponseMapper {
  static run<T extends UseCaseResponse>(response: T): HttpResponseBody {
    const { data } = response;
    return {
      data
    };
  }
}
