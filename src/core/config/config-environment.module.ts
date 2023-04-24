import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports:[
        ConfigModule.forRoot({
            envFilePath: [`.env.${process.env.NODE_ENV}`],
        })
    ]
})

export class ConfigEnvironment{}