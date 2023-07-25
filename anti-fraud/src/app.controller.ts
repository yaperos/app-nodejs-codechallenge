import { Controller, Post, Body, Logger, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { LoggingInterceptor } from './support/logging.interceptor';

@Controller('app')
export class AppController {
    private readonly logger = new Logger(AppController.name);
    constructor(
        private readonly appService: AppService
    ) { }

    @Post('/validar-transaccion')
    @UseInterceptors(LoggingInterceptor)
    validarTransaccion(@Body() datosTransaccion: any): object {
        this.logger.log('1. validarTransaccion - payload');
        this.logger.log(datosTransaccion);
        const resultadoValidacion = this.appService.validarTransaccion(datosTransaccion);
        this.logger.log('2. validarTransaccion - result');
        this.logger.log(resultadoValidacion);
        return resultadoValidacion;
    }
}
