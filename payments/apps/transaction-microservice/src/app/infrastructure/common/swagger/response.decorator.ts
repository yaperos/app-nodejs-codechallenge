import { applyDecorators, Type } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";

const getDecorator = (model: Type<any>, isArray: boolean, mainResponseCode: number) => {
  switch(mainResponseCode){
    case 200:
      return ApiOkResponse({
        isArray: isArray,
        schema: {
          allOf: [
            { $ref: getSchemaPath(model)},
          ],
        },
      });
    case 201:
      return ApiCreatedResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(model)},
          ],
        },
      });
    default:
      return ApiOkResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(model) },
          ],
        },
      });
  }
};

export const ApiResponseType = <TModel extends Type<any>>(model: TModel, isArray: boolean, mainResponseCode: number) => {
    return applyDecorators(getDecorator(model,isArray, mainResponseCode));
};

