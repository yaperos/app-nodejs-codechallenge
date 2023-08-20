import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, HttpStatus } from '@nestjs/common';
import { ValidationError, validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { metaDataValidacionError } from './error';
import { Builder } from 'builder-pattern';
import { MensajeMetaData,TypeError } from '../app/modelos';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
        const mensajesError=this.convertirValidationAMensajeMetaData(errors)
      throw metaDataValidacionError("",mensajesError)
    }
    return value;
  }
  private convertirValidationAMensajeMetaData(errors: ValidationError[]):MensajeMetaData[]{
    let metaErros:MensajeMetaData[]=[]
    errors.forEach((error)=>Object.keys(error.constraints).forEach((key)=> 
        metaErros.push(
            Builder<MensajeMetaData>()    
                .code(HttpStatus.BAD_REQUEST)
                .type(TypeError.warn)
                .message( error.constraints[key])
                .build() )
        )
    )
    return metaErros
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}