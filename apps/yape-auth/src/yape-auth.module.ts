import { Module } from '@nestjs/common';
import { YapeAuthController } from './yape-auth.controller';
import { YapeAuthService } from './yape-auth.service';

@Module({
  imports: [],
  controllers: [YapeAuthController],
  providers: [YapeAuthService],
})
export class YapeAuthModule {}
