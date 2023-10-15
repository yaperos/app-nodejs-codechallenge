import { InternalServerErrorException } from "@nestjs/common";

export class TransactionTruncatedException extends InternalServerErrorException {}
