import { Module } from "@nestjs/common";
import { ConfigService } from "./config.service";

let envFile = 'dev.env';
if(`${process.env.NODE_ENV}` !== 'undefined') {
    envFile = `${process.env.NODE_ENV}.env`;
}
console.log('envFile', envFile);

@Module({
    providers: [
        {
            provide: ConfigService,
            useValue: new ConfigService(envFile)
        }
    ],
    exports: [ConfigService]
})
export class ConfigurationModule{}