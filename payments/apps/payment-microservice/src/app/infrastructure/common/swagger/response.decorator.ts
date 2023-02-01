import { applyDecorators, Type } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { ResponseFormat } from "../interceptors/response.interceptors";

const getDecorator = (model: Type<any>, isArray: boolean, mainResponseCode: number) => {
  switch(mainResponseCode){
    case 200:
      return ApiOkResponse({
        isArray: isArray,
        schema: {
          allOf: [
            { $ref: getSchemaPath(ResponseFormat) },
            {
              properties: {
                data: {
                  $ref: getSchemaPath(model),
                },
                isArray: {
                  type: 'boolean',
                  default: isArray,
                },
              },
            },
          ],
        },
      });
    case 201:
      return ApiCreatedResponse({
        schema: {
          allOf: [
            { $ref: getSchemaPath(ResponseFormat) },
            { $ref: getSchemaPath(model)},
          ],
        },
      });
    default:
      return ApiOkResponse({
        isArray: isArray,
        schema: {
          allOf: [
            { $ref: getSchemaPath(ResponseFormat) },
            {
              properties: {
                data: {
                  $ref: getSchemaPath(model),
                },
                isArray: {
                  type: 'boolean',
                  default: isArray,
                },
              }
            },
          ],
        },
      });
  }
};

export const ApiResponseType = <TModel extends Type<any>>(model: TModel, isArray: boolean, mainResponseCode: number) => {
    return applyDecorators(getDecorator(model,isArray, mainResponseCode));
};

