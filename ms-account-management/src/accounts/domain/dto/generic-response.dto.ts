import { Builder } from 'builder-pattern';

export class GenericResponseDto {
  public message: string;

  public static builder() {
    return Builder<GenericResponseDto>();
  }
}
