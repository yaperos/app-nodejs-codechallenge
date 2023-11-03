import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = this.extractTokenFromHeader(request);
    return (
      this.configService.get<string>('API_KEY') &&
      apiKey &&
      apiKey === this.configService.get<string>('API_KEY')
    );
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const apiKey = request.headers['api-key'];
    return apiKey;
  }
}
