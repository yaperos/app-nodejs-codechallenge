import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../modules/auth/auth.module';
import { UsersModule } from '../modules/users/users.module';

@Module({
  imports: [CommonModule, AuthModule, UsersModule],
})
export class AppModule {}
