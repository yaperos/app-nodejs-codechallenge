import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class EnvironmentConfigService {

    constructor(private configService: ConfigService) { }

    getPort(): number {
        return this.configService.get<number>('PORT');
    }

    getDatabaseHost(): string {
        return this.configService.get<string>('DATABASE_HOST');
      }
    
      getDatabasePort(): number {
        return this.configService.get<number>('DATABASE_PORT');
      }
    
      getDatabaseUser(): string {
        return this.configService.get<string>('DATABASE_USER');
      }
    
      getDatabasePassword(): string {
        return this.configService.get<string>('DATABASE_PASSWORD');
      }
    
      getDatabaseName(): string {
        return this.configService.get<string>('DATABASE_NAME');
      }
    
      getDatabaseSchema(): string {
        return this.configService.get<string>('DATABASE_SCHEMA');
      }
    
      getDatabaseSync(): boolean {
        return this.configService.get<boolean>('DATABASE_SYNCHRONIZE');
      }

      getDatabaseLoadEntities(): boolean {
        return this.configService.get<boolean>('DATABASE_AUTOLOAD_ENTITIES');
      }
}