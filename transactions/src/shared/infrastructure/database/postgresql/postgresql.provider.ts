import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

export const PostgresProvider = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => {
    return {
      type: 'postgres',
      host: configService.get('POSTGRES_HOST'),
      port: configService.get('POSTGRES_PORT'),
      username: configService.get('POSTGRES_USER'),
      password: configService.get('POSTGRES_PASSWORD'),
      database: configService.get('POSTGRES_DATABASE'),
      // entities: [User],
      entities: ['dist/**/infrastructure/**/*.entity.js'],
      synchronize: false,
    };
  },
  inject: [ConfigService],
});
