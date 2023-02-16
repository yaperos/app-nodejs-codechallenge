import { Injectable } from '@nestjs/common';
import { ValidValuesEnum } from './enums/valid-values.enum';
@Injectable()
export class AppService {
  valueValidation(value: number): boolean{
    try{
      this.isLowerThanMaxValue(value);
      return true;
    }
    catch(e){
      return false;
    }
  }
  
  isLowerThanMaxValue(value: number){
    if(value > ValidValuesEnum.MAX_VALID_VALUE) throw new Error(`Value greater than ${ValidValuesEnum.MAX_VALID_VALUE}`)
  }
}
