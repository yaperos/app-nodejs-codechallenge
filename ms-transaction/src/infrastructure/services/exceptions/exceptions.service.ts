import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  IException,
  IFormatExceptionMessage,
} from '../../../shared/interfaces/exceptions.interface';

@Injectable()
export class ExceptionsService implements IException {
  badRequestException(data: IFormatExceptionMessage): void {
    throw new BadRequestException(data);
  }
  notFoundException(data: IFormatExceptionMessage): void {
    throw new NotFoundException(data);
  }
  internalServerErrorException(data?: IFormatExceptionMessage): void {
    throw new InternalServerErrorException(data);
  }
  forbiddenException(data?: IFormatExceptionMessage): void {
    throw new ForbiddenException(data);
  }
  UnauthorizedException(data?: IFormatExceptionMessage): void {
    throw new UnauthorizedException(data);
  }
  badGatewayException(data?: IFormatExceptionMessage): void {
    throw new BadGatewayException(data);
  }
  methodNotAllowedException(data?: IFormatExceptionMessage): void {
    throw new MethodNotAllowedException(data);
  }
  conflictException(data?: IFormatExceptionMessage): void {
    throw new ConflictException(data);
  }
}
