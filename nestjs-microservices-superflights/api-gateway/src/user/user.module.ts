import { Module } from '@nestjs/common';
import { ProxyModule } from 'src/common/proxy/proxy.module';
import { UserController } from './user.controller';

@Module({
  imports: [ProxyModule],
  controllers: [UserController],
})
export class UserModule {}
