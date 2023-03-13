import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AppController } from "./app.controller";
import { Config } from "./config/config.module";
import { ValidationModule } from "./validation/validation.module";

@Module({
    imports: [
        Config,
        ValidationModule,
    ],
    controllers: [AppController],
    providers: [ConfigService],
})
export class AppModule {}
