import {UseCase} from "../../../shared/core/use-case";
import {AuthVerifyCommand} from "./auth-verify.cmd";
import {verify,decode} from "jsonwebtoken";
import {ConfigService} from "@nestjs/config";
import {IUserRepo, USER_REPO} from "../../domain/user.repo";
import {Inject, Injectable} from "@nestjs/common";
import {Result, success} from "../../../shared/core/result";

@Injectable()
export class AuthVerifyUseCase
  implements UseCase<AuthVerifyCommand, Promise<Response>> {

  constructor(
    private readonly config: ConfigService,
  ) {
  }

  async execute(request: any): Promise<any> {
    const { token } = request;
    console.log('AuthVerifyUseCase', token)
    return success(Result.ok({
      isValid: await this.verifyToken(token),
    }));
  }

  public async verifyToken(token: string): Promise<boolean> {
    try{
      const isValid = verify(token,this.config.get('JWT_SECRET'));
      console.log('AuthVerifyVerify', isValid)
      return true;
    }catch (e) {
      console.log('AuthVerifyUsecaseError', e)
      return false;
    }
  }
}