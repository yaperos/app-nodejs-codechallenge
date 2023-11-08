export class ErrorResponse {
  status: number;
  title: string;
  type: string;
  data: Record<string, any>;
  path: string;

  constructor(
    status: number,
    title: string,
    type: string,
    data: Record<string, any>,
    path: string,
  ) {
    this.status = status;
    this.title = title;
    this.type = type;
    this.data = data;
    this.path = path;
  }
}
