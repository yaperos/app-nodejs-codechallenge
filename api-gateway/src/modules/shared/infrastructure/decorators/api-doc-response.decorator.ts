import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiResponse, ApiResponseOptions } from '@nestjs/swagger';

import {
  BadRequestResponseDto,
  ConflictResponseDto,
  InternalServerErrorResponseDto,
  NotFoundResponseDto,
  UnprocessableEntityResponseDto,
} from '../dtos/error';

const defaultApiResponses: { [key: number]: ApiResponseOptions } = {
  [HttpStatus.CREATED]: {
    status: HttpStatus.CREATED,
    description: 'Created',
  },
  [HttpStatus.NO_CONTENT]: {
    status: HttpStatus.NO_CONTENT,
    description: 'No Content',
  },
  [HttpStatus.BAD_REQUEST]: {
    status: HttpStatus.BAD_REQUEST,
    description: 'Bad Request',
    type: BadRequestResponseDto,
  },
  [HttpStatus.NOT_FOUND]: {
    status: HttpStatus.NOT_FOUND,
    description: 'Not Found',
    type: NotFoundResponseDto,
  },
  [HttpStatus.CONFLICT]: {
    status: HttpStatus.CONFLICT,
    description: 'Conflict',
    type: ConflictResponseDto,
  },
  [HttpStatus.UNPROCESSABLE_ENTITY]: {
    status: HttpStatus.UNPROCESSABLE_ENTITY,
    description: 'Unprocessable entity',
    type: UnprocessableEntityResponseDto,
  },
  [HttpStatus.INTERNAL_SERVER_ERROR]: {
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Internal server error',
    type: InternalServerErrorResponseDto,
  },
};

export function ApiDocResponse(
  ...docResponses: Array<ApiResponseOptions | HttpStatus>
) {
  const apiResponses = docResponses.map((docResponse) => {
    if (typeof docResponse === 'number') {
      docResponse = defaultApiResponses[docResponse];
    }
    return ApiResponse(docResponse);
  });

  return applyDecorators(...apiResponses);
}
