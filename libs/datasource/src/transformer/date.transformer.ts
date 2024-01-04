import { ValueTransformer } from "typeorm"

export class DateValueTransformer implements ValueTransformer {
  to(value: any): any {
    return value
  }

  from(value: any): any {
    return value && value instanceof Date ? value?.toISOString() : value
  }
}