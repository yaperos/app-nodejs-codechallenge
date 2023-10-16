import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserDTO } from 'src/users/dto/user.dto';

export const AuthenticatedAccount = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserDTO => {
    try {
      const request = ctx.switchToHttp().getNext().req.user;
      return request;
    } catch (error) {
      throw new ForbiddenException();
    }
  },
);
