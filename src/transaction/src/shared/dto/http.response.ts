export class HttpResponse{

    httpCode: number
    data: any

    constructor(httpCode: number = 200, data: any= {}){
        this.httpCode = httpCode
        this.data = data
    }

}