import { HttpException, HttpStatus } from "@nestjs/common";
import { MetaData } from "../app/modelos";

export class YapeException extends HttpException {
    constructor(error:HttpStatus,_meta:MetaData) {
        super(_meta, error)
    }
}