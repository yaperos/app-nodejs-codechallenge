import { RequestHandler, Router, Request, Response, NextFunction } from "express"
import { ObjectSchema } from "joi"

export enum Http {
    Post = "POST",
    Get = "GET",
    PUT = "PUT",
    PATCH = "PATCH",
    DELETE = "DELETE",
    OPTIONS = "OPTIONS"
}

export interface Group {
    version: string;
    subject: string;
    routes: Route[];
    caseSensitive: boolean;
    mergeParams: boolean;
    strict: boolean;
}

export interface HttpResponse<Data> {
    statusCode?: number,
    success?: boolean,
    messageId?: string,
    message?: string,
    kindMessage?: string,
    data?: Data,
    error?: string,
}

export interface Validate {
    payload?: ObjectSchema
    query?: ObjectSchema
    headers?: ObjectSchema
    params?: ObjectSchema
}


export interface Route {
    method: string
    url: string
    validate: Validate
    handler: RequestHandler
}

export default class Express {
    static validate(data: any, obj?: ObjectSchema){
        const err = obj?.validate(data);

        if (err && err.error) {
            throw new Error(`Invalid data => ${err.error.message}`);
        }
    }

    static getValidator(schema: Validate) {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                this.validate(req.body, schema.payload);
                this.validate(req.query, schema.query);
                this.validate(req.headers, schema.headers);
                this.validate(req.params, schema.params);
            } catch(err: any){
                let response: HttpResponse<null> = {}
                response.statusCode = 500
                response.message = err.message
                response.success = false

                res.status(response.statusCode).send(response)
                return
            }

            next()
        }
    }

    static createRoute(group: Group): Router {
        let router = Router({
            caseSensitive: group.caseSensitive,
            mergeParams: group.mergeParams,
            strict: group.strict
        })

        group.routes.forEach((route) => {
            const url = `/${group.version}/${group.subject}` + (route.url == "" ? "" : `${route.url}`)

            switch (route.method) {
                case Http.Post:
                    router.post(url, this.getValidator(route.validate), route.handler)
                    break
                case Http.Get:
                    router.get(url, this.getValidator(route.validate), route.handler)
                    break
                case Http.PUT:
                    router.put(url, this.getValidator(route.validate), route.handler)
                    break
                case Http.DELETE:
                    router.delete(url, this.getValidator(route.validate), route.handler)
                    break
                case Http.PATCH:
                    router.patch(url, this.getValidator(route.validate), route.handler)
                    break
                case Http.OPTIONS:
                    router.options(url, this.getValidator(route.validate), route.handler)
                    break
            }
        })
        
        return router
    }
}

export const urlNotFound = () => {
    return (_req: Request, res: Response) => {
        let response: HttpResponse<null> = {}
        response.statusCode = 404
        response.message = "Url not found"
        response.success = false

        res.status(response.statusCode).send(response)
    }
}