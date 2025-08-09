import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

/* Project */
import { EnvValidation } from './common/validators';
import { KafkaModule } from './common/kafka';
import { AntiFraudModule } from './cases/anti-fraud';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      expandVariables: true,
      validate: EnvValidation,
    }),
    KafkaModule,
    AntiFraudModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
