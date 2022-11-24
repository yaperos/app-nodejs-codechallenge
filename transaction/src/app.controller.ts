import { Body, Controller, Get, Inject, Logger, Post } from "@nestjs/common";
import { AppService } from './app.service';
import { ClientProxy, MessagePattern, Payload } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

@Controller("/app")
export class AppController {

  constructor(
    private readonly appService: AppService,
   /* @Inject('KAFKA')
    private readonly kafka: ClientProxy,*/
  ) {}


  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

}
