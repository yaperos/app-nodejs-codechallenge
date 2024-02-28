/*import * as Joi from 'joi';

export const EnvironmentConfigValidation = Joi.object({
    PORT: Joi.string().required()   
})*/

import { plainToClass } from "class-transformer";
import { IsBoolean, IsNumber, IsString, validateSync } from "class-validator";

class EnvironmentVariables {

    @IsNumber()
    PORT: number;

    @IsString()
    DATABASE_HOST: string;
    @IsNumber()
    DATABASE_PORT: number;
    @IsString()
    DATABASE_USER: string;
    @IsString()
    DATABASE_PASSWORD: string;
    @IsString()
    DATABASE_NAME: string;
    @IsString()
    DATABASE_SCHEMA: string;
    @IsBoolean()
    DATABASE_SYNCHRONIZE: boolean;
    @IsBoolean()
    DATABASE_AUTOLOAD_ENTITIES: boolean;
}


export function EnvironmentConfigValidation(config: Record<string, unknown>) {
    const validatedConfig = plainToClass(EnvironmentVariables, config, {
      enableImplicitConversion: true,
    });
    const errors = validateSync(validatedConfig, { skipMissingProperties: false });
  
    if (errors.length > 0) {
      throw new Error(errors.toString());
    }
    return validatedConfig;
  }