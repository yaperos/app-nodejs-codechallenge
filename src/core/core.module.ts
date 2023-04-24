import { Module } from "@nestjs/common";
import { ConnectionDb } from "./database";
import { ConfigEnvironment } from "./config";
import { GraphQLConfig } from "./graphQl";
import { InterceptorIdentifierModule } from "./interceptor";

@Module({
    imports:[ConnectionDb, ConfigEnvironment, GraphQLConfig,InterceptorIdentifierModule],
    providers:[],
})
export class CoreModule {}