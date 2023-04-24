import { CallHandler, ExecutionContext, Injectable, NestInterceptor , HttpException, HttpStatus} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Observable, from } from "rxjs";

@Injectable()
export class InterceptorIdentifierService implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
        let request = context.switchToHttp().getRequest();
        if (!request) {
            const ctx = GqlExecutionContext.create(context);
            request = ctx.getContext().req;
          }
        const headerAuth: string[] = request.headers.authorization
        ? request.headers.authorization.split(' ')
        : [request.query.token];
        return this.validateIdentifier(headerAuth[0]).then((data) => {
            return next.handle();
        });
    }

    public async validateIdentifier(identifier: string): Promise<any> {
        if(identifier=='12345') {
            return { token: "12345" }
        }else{
            throw new HttpException("unauthorizer", HttpStatus.UNAUTHORIZED || HttpStatus.UNAUTHORIZED)
        }

    }
}