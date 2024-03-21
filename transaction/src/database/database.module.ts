import { DynamicModule, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPEORM_OPTIONS } from '../constants';

@Global()
@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forRootAsync({
            useFactory: async(options) => options,
            inject: [TYPEORM_OPTIONS],
        })
    ],
    providers: [
        {
            provide: TYPEORM_OPTIONS,
            useFactory: async (configService: ConfigService) => configService.get('config.database'),
            inject: [ConfigService],
        }
    ],
    exports: [TypeOrmModule, TYPEORM_OPTIONS]
})
export class DatabaseModule {    
    static forFeature(features): DynamicModule {
        return TypeOrmModule.forFeature(features);
    }
}
