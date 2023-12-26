import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
require("dotenv").config();

const log4js = require("log4js");

const logType = process.env.LOG_TYPE ? process.env.LOG_TYPE : 'file';
const logFilename = process.env.LOG_FILENAME ? process.env.LOG_FILENAME : 'logs/app.log';
const lognumBackups = process.env.LOG_numBackups ? process.env.LOG_numBackups : '';
const logLevel = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info';

log4js.configure({
  appenders: {
    ms_appenders: {
      type: logType,
      filename: logFilename,
      numBackups: lognumBackups
    }
  },
  categories: {
    default: { appenders: ['ms_appenders'], level: logLevel }
  }
});

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const logger = log4js.getLogger(context.getClass().name);

    const http = context.switchToHttp();
    const request = http.getRequest();
    logger.log(context.getHandler().name + " Before");

    logger.log(request.method);
    if (request.method === "GET") {
      logger.log(context.getHandler().name + ".request.query:", request.query);
    }
    if (request.method != "GET") {
      if (request.body === undefined || request.body === "undefined") {
        logger.log(context.getHandler().name + ".request.payload:", request);
      } else {
        logger.log(context.getHandler().name + ".request.body:", request.body);
      }
    }

    const now = Date.now();
    return next.handle().pipe(
      //catchError(err => logger.error(err) ),

      tap((response) => {

        if (response.length == 1  || response.length==undefined) {
          logger.log("Response: ",response)
        } else {
          logger.log(`Registros : ${(response || []).length}`);
        }
        logger.log(
          context.getHandler().name + ` After... ${Date.now() - now}ms`
        );
      })
    );
  }
}
