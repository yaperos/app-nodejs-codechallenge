export interface IExceptionMapper {
  map(exception: Error): Record<string, any>;
}
