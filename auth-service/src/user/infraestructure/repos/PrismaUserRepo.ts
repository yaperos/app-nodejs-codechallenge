import { Injectable } from '@nestjs/common';
import { IUserRepo } from '../../domain/user.repo';
import { PrismaService } from '../../../prisma/prisma.service';
import { User, UserProps } from '../../domain/user';
import { UserID } from '../../domain/user-id';
import { UserName } from '../../domain/user-name';
import { UserLastname } from '../../domain/user-lastname';
import { UserStatus } from '../../domain/user-status';
import { Result } from '../../../shared/core/result';
import { UserPassword } from '../../domain/user-password';
import { UserEmail } from '../../domain/user-email';

@Injectable()
export class PrismaUserRepo implements IUserRepo {
  constructor(private readonly prismaService: PrismaService) {}

  async userExists(email: string): Promise<boolean> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email,
        },
      });
      return !!user === true;
    } catch (e) {
      return false;
    }
  }

  async getByEmail(email: string): Promise<User> {
    const dbUserResponse = await this.prismaService.user.findFirst({
      where: {
        email: email,
      },
    });
    if(!dbUserResponse) {
      throw new Error('User not found');
    }
    const user = User.create({
      id: UserID.create(dbUserResponse.id).getValue(),
      email: UserEmail.create(dbUserResponse.email).getValue(),
      password: UserPassword.create(dbUserResponse.password).getValue(),
      status: UserStatus.create(dbUserResponse.status).getValue(),
    });
    return user.isFailure ? null : user.getValue();
  }

  async createUser(user: User, hashed: boolean): Promise<User> {
    try {
      console.log('Creating User', user)
      // @ts-ignore
      return this.prismaService.user.create({
        data: {
          id: user.id.props._id,
          email: user.email.value,
          password: await user.password.getHashedPassword(),
          name: user.name.value,
          lastName: user.lastName.value,
        },
      });
    } catch (e) {
      throw new Error(e);
    }
  }
}