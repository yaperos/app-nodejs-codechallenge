import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ApplicationModule } from './application/application.module';
import { DomainModule } from './domain/domain.module';
import { InfrastructureModule } from './infrastructure/infrastructure.module';

@Module({
  imports: [ApplicationModule, DomainModule, InfrastructureModule.foorRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
