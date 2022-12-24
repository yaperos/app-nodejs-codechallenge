import { Expose, Exclude } from 'class-transformer'

class ValidationError {
  readonly property: string
  readonly constraints: string[]
}

@Exclude()
export class HttpErrorDto {
  @Expose()
  readonly message: string

  @Expose()
  readonly statusCode: number

  @Expose()
  readonly errors?: ValidationError[]
}
