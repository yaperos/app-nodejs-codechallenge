import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { graphqlConfig } from './shared/config/graphql.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    graphqlConfig,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
