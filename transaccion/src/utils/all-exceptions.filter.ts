import { Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Builder } from 'builder-pattern';
import { MensajeMetaData, MetaData, TypeError } from '../app/modelos';
import { YapeException } from './yape.exception';
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost) {
    console.log("ingreso a control de errores generales")
    console.log(exception)
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    
    if(exception instanceof YapeException){
      super.catch(exception,host)
    }else if(exception instanceof HttpException){
      console.log("error error no controlado")
      let responseBody =Builder<MetaData>()
        .idTransaccion("")
        .mensajes([Builder<MensajeMetaData>().code("-1").message("error interno").type(TypeError.fatal).build()])
      .build();
      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }else{
      let responseBody =Builder<MetaData>()
        .idTransaccion("")
        .mensajes([Builder<MensajeMetaData>().code("-1").message("error interno").type(TypeError.fatal).build()])
      .build();
      httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
    }
  }
}