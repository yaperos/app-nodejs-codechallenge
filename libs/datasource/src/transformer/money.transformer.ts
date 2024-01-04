import { ValueTransformer } from "typeorm"

export class MoneyValueTransformer implements ValueTransformer {
  to(value: any): any {
    return value
  }

  from(value: any): any {
    return value && value.replace ? parseFloat(value.replace(/[$,]/g, "")) : value
  }
}