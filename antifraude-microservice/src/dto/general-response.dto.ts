export class GeneralResponse {

    public readonly message: string

    public readonly code: number

    public readonly data: any

    constructor(
        message: string,
        code: number,
        data: any = null
      ) {
        this.message = message;
        this.code = code;
        this.data = data;
      }
    

    
}
  