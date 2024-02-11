import { Module } from '@nestjs/common';
import { ApolloGatewayModule } from './apollo-gateway';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      expandVariables: true,
    }),
    ApolloGatewayModule,
  ],
})
export class AppModule {}
