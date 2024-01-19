export abstract class BaseResponseDto {
  code: number;
  error?: string;
  messages?: string[];
}
