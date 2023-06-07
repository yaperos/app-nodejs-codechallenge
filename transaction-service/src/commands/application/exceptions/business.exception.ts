import { HttpException, HttpStatus } from "@nestjs/common";

export class BusinessException extends HttpException {
    code: string;
    httpStatus: HttpStatus;

    constructor(code: number, message: string, httpStatus: HttpStatus) {
        super({code, message: `${code} - ${message}`}, httpStatus);
    }
}