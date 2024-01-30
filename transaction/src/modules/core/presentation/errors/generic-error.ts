import { ApiProperty } from '@nestjs/swagger';

export class GenericError {
    @ApiProperty({
        type: 'string',
        example: 'status code',
    })
    statusCode?: number;

    @ApiProperty({
        type: 'string',
        example: 'Error message',
    })
    message?: string;

    @ApiProperty({
        type: 'string',
        example: 'Error description',
    })
    error?: string;
}

export enum ResponseDescription {
    BAD_REQUEST = 'Malformed request',
    API_GATEWAY_TIMEOUT = 'Operation timeout',
    INTERNAL_SERVER_ERROR = 'Internal server error',
}