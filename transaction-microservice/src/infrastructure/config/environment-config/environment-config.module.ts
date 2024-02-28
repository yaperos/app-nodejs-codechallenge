import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { EnvironmentConfigService } from "./environment-config.service";
import { EnvironmentConfigValidation } from "./environment-config.validation";


@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: './env/local.env',
            isGlobal: true,
            validate: EnvironmentConfigValidation
        }),
    ],
    providers: [EnvironmentConfigService],
    exports: [EnvironmentConfigService],
})
export class EnvironmentConfigModule { }