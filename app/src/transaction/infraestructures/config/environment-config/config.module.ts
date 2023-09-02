import { Module } from "@nestjs/common";
import { EnvironmentConfigService } from "./config.service";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports:[
        ConfigModule.forRoot({
            ignoreEnvFile:  process.env.NODE_ENV === 'production' ? true:false,               
            isGlobal: true
        })
    ],
    providers:[EnvironmentConfigService],
    exports:[EnvironmentConfigService]
})
export class EnvironmentConfigModule{
    
}