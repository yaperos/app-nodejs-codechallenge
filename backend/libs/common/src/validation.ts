import { ValidationPipe } from "@nestjs/common";

export function createValidationPipe() {
  return new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidUnknownValues: true,
    forbidNonWhitelisted: true,
    transformOptions: { enableImplicitConversion: true },
  });
}