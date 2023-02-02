import {Injectable, NotAcceptableException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "@yape/yape-domain/entity/user.entity";
import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import {AuthDto, TokenDto} from "@yape/yape-domain/dto/auth.dto";

@Injectable()
export class YapeAuthService {
  @InjectRepository(UserEntity)
  private readonly repository: Repository<UserEntity>
  constructor(private jwtService: JwtService) { }
  async login(username: string, password: string): Promise<TokenDto> {
    const user = await this.repository.findOne({ where: {username} });

    if (!user) {
      throw new UnauthorizedException('could not find the user');
    }
    const passwordValid = await bcrypt.compare(password, user.password)
    if (passwordValid) {
      const payload = { username: user.username, sub: user.id };

      return {
        accessToken: this.jwtService.sign(payload),
      };
    }

    throw new UnauthorizedException('Password is incorrect');
  }

  public async validate(token: string): Promise<AuthDto> {
    const decoded: UserEntity = await this.jwtService.verify(token);

    if (!decoded) {
      throw new UnauthorizedException('Token is incrrect');
    }
    const auth = await this.repository.findOne({ where: {id: decoded.id} });

    if (!auth) {
      throw new UnauthorizedException('Token is incrrect');
    }

    return {
      id: auth.id,
    };
  }

}
