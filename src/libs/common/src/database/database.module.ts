import { Module } from '@nestjs/common'
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose'
import { ConfigService } from '@nestjs/config'
import { ConfigModule } from '@app/common/config/config.module'

@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [
                ConfigModule,
            ],
            useFactory: (configService: ConfigService) => ({
                uri: configService.get('DB_URL'),
                dbName: configService.get('DB_NAME'),
            }),
            inject: [ConfigService]
        })
    ]
})
export class DatabaseModule {
    static forFeature(models: ModelDefinition[]) {
        return MongooseModule.forFeature(models)
    }
}
