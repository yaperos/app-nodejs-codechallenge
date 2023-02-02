import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {AuthModule} from "./auth/auth.module";
import {TxModule} from "./tx/tx.module";

@Module({
  imports: [AuthModule, TxModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
