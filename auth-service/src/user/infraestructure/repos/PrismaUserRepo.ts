import {Injectable} from "@nestjs/common";
import {IUserRepo} from "../../domain/user.repo";
import {PrismaService} from "../../../prisma/prisma.service";
import {User, UserProps} from "../../domain/user";
import {UserID} from "../../domain/user-id";
import {UserName} from "../../domain/user-name";
import {UserLastname} from "../../domain/user-lastname";
import {UserStatus} from "../../domain/user-status";
import {Result} from "../../../shared/core/result";
import {UserPassword} from "../../domain/user-password";
import {UserEmail} from "../../domain/user-email";

@Injectable()
export class PrismaUserRepo implements IUserRepo {
  constructor(private readonly prismaService: PrismaService) {
  }

  async userExists(email: string): Promise<boolean> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email
        },
      });
      console.log(!!user === true);
      return !!user === true;
    } catch (e) {
      console.log('return false');
      return false;
    }
  }

  async getByEmail(email: string): Promise<User> {
    const dbUserResponse = await this.prismaService.user.findFirst({
      where: {
        email: email,
      }
    });
    const userProps: UserProps = {
      id: UserID.create(dbUserResponse.id).getValue(),
      email: UserEmail.create(dbUserResponse.email).getValue(),
      password: UserPassword.create(dbUserResponse.password).getValue(),
      name: UserName.create(dbUserResponse.name).getValue(),
      lastName: UserLastname.create(dbUserResponse.lastName).getValue(),
      status: UserStatus.create(dbUserResponse.status).getValue(),
    }
    const values = Result.combine<UserProps>(userProps);
    if (values.isFailure) throw new Error("User not found");

    const userResult = User.create(values.getValue());
    if (userResult.isFailure) throw new Error("User not found");
    return userResult.getValue();
  }

  async createUser(user: any, hashed: boolean): Promise<User> {
    try {
      const userCheck = await this.userExists(user.email);
      if (!userCheck) {
        // @ts-ignore
        return this.prismaService.user.create({
          data: {
            id: user.id,
            email: user.email,
            password: user.password,
            name: user.name,
            lastName: user.lastname,
          }
        });
      }
      return;
    } catch (e) {
      console.log('user - ', JSON.stringify(user))
      console.log('error - ', e)
    }
  }
}