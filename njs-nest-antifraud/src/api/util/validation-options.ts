
import { BadRequestException } from "@nestjs/common";

export function validateIdTransaccion(idTransaccion:string){
  if (!idTransaccion) {
    throw new BadRequestException();
  }
}
