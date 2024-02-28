/*import * as Joi from 'joi';

export const EnvironmentConfigValidation = Joi.object({
    PORT: Joi.string().required()   
})*/

import { plainToClass } from "class-transformer";
import { IsBoolean, IsNumber, IsString, validateSync } from "class-validator";

class EnvironmentVariables {

    @IsNumber()
    PORT: number;
  
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