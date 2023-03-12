import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { getConfig } from "./config";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ["../.env"],
            load: [getConfig],
        }),
    ],
})
export class Config {}
