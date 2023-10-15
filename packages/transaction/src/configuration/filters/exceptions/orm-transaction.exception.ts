import { InternalServerErrorException } from "@nestjs/common";

export class OrmTransactionException extends InternalServerErrorException {}
