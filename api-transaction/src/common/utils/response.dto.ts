export class ResponseDto {
  constructor(
    public status: number = 200,
    public data: any,
    public errors: any = null) { }
}