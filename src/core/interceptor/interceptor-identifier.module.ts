import { Module } from "@nestjs/common";
import { InterceptorIdentifierService } from "./interceptor-identifier.service";

@Module({
    providers:[InterceptorIdentifierService],
    exports:[InterceptorIdentifierService]
})
export class InterceptorIdentifierModule{}