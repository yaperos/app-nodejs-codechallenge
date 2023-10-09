import { HttpCode } from "../enums/http-code.enum";

interface AppErrorArgs {
    name?: string;
    message: string;
    httpCode: HttpCode;
    isOperational?: boolean;
    
}

export class CustomError extends Error {
    public readonly name: string;
    public readonly httpCode: HttpCode;
    public readonly isOperational: boolean = true;

    constructor(args: AppErrorArgs) {
        super(args.message);

        this.name = args.name ?? 'Error';
        this.httpCode = args.httpCode;

        if (args.isOperational !== undefined) {
            this.isOperational = args.isOperational;
        }
    }
}