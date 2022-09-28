import { NotFoundException } from "@nestjs/common";

interface ValueObject<T> {
  valueOf(): T;
  fromPrimitive(value: T): ValueObject<T>;
  validate(value: T): void;
}
export const TRANFER_TYPE_NAME = {
  1: 'IMPS',
  2: 'NEFT',
  3: 'RTGS',
}
export enum TRANFER_TYPE {
   IMPS = 1,
   NEFT = 2,
   RTGS = 3,
}


export class tranferTypeIdObject implements ValueObject<number> {
  readonly value: number;

  constructor(value: number) {
    this.value = value;
  }

  fromPrimitive(value: number): ValueObject<number> {
    return new tranferTypeIdObject(value);
  }

  valueOf(): number {
    return this.value;
  }
  validate(): void {
    if(!(this.value in TRANFER_TYPE))
    throw new NotFoundException(`tranferTypeId not valid, send ${JSON.stringify(TRANFER_TYPE_NAME)}`);
  }
}
