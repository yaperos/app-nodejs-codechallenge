import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserSchema } from './schema/user.schema';
import { USER } from 'src/common/models/models';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user.controller';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([
      {
        name: USER.name,
        useFactory: () => UserSchema,
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
