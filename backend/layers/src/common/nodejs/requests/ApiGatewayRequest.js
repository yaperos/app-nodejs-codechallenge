"use strict";

const JsonValidator = require("../lib/JsonValidator");

class ApiGatewayRequest {
  constructor(event) {
    this.event = event;
  }

  /**
   * Método para validar los parámetros de un request
   *
   * @returns {boolean}
   */
  validate() {
    let result = {
      valid: true,
      errors: [],
    };

    if (this.validationRules) {
      if (this.validationRules.pathParams) {
        const pathParamsValidator = JsonValidator.validate(
          this.getPathParams(),
          this.validationRules.pathParams
        );

        result.valid = result.valid && pathParamsValidator.valid;
        result.errors = result.errors.concat(pathParamsValidator.errors);
      }

      if (this.validationRules.queryParams) {
        const queryParamsValidator = JsonValidator.validate(
          this.getQueryParams(),
          this.validationRules.queryParams
        );

        result.valid = result.valid && queryParamsValidator.valid;
        result.errors = result.errors.concat(queryParamsValidator.errors);
      }

      if (this.validationRules.bodyParams) {
        try {

          let body = this.getBody();

          if (this.bodySchema) {
            body = this.getBodyParamsFromSchema();
          }

          if (!body) {
            throw new Error("Invalid request body");
          }

          const bodyParamsValidator = JsonValidator.validate(
            body,
            this.validationRules.bodyParams
          );

          result.valid = result.valid && bodyParamsValidator.valid;

          result.errors = result.errors.concat(bodyParamsValidator.errors);

        } catch (e) {
          result.valid = false;
          result.errors.push({
            message:
              "Invalid request body, please verify the structure of your request",
          });
        }
      }
    }

    return result;
  }

  /**
   * Método para obtener los queryParams de un request
   *
   * @returns {array}
   */
  getQueryParams() {
    return this.event.queryStringParameters || {};
  }

  /**
   * Método para obtener un queryParam especifico
   *
   * @param {string} keyParam Identificador del parámetro a obtener
   * @param {*} defaultValue Valor por defecto en caso de que no exista el parámetro
   *
   * @returns {*}
   */
  getQueryParam(keyParam, defaultValue) {
    let param = defaultValue;

    const queryParams = this.getQueryParams();

    if (!queryParams) {
      return param;
    }

    if (typeof queryParams[keyParam] !== "undefined") {
      param = queryParams[keyParam];
    }

    return param;
  }

  /**
   * Método para obtener el body de un request
   *
   * @returns {object}
   */
  getBody() {
    let body = null;

    try {
      body = JSON.parse(this.event?.body ?? "{}");
    } catch (e) {
      Sentry.captureException(e);
    }
    return body;
  }

  /**
   * Método para obtener los pathParams de un request
   *
   * @returns {array}
   */
  getPathParams() {
    return this.event.pathParameters || {};
  }

  /**
   * Método para obtener un pathparam especifico
   *
   * @param {string} keyParam Identificador del parámetro a obtener
   * @param {*} defaultValue Valor por defecto en caso de que no exista el parámetro
   *
   * @returns {*}
   */
  getPathParam(keyParam, defaultValue) {
    let param = defaultValue;

    const pathParams = this.getPathParams();

    if (!pathParams) {
      return param;
    }

    if (typeof pathParams[keyParam] !== "undefined") {
      param = pathParams[keyParam];
    }

    return param;
  }

  /**
   * Retorna un objeto a partir de un esquema dado
   *
   * @param {*} object Objeto de dónde se obtiene las propiedades
   * @param {*} schema Esquema con propiedades a obtener
   *
   * @returns {object}
   */
  getObjectFromSchema(object, schema) {

    let result = null;
    if (Array.isArray(object) && Array.isArray(schema)) {
      let array = object
      let jsonSchema = schema[0]
      if (result === null) {
        result = [];
      }
      array.forEach(obj => {
        result.push(this.getObjectFromSchema(obj, jsonSchema))
      })
    }
    else if (object && schema) {
      Object.keys(schema).map((schemaKey) => {
        const schemaValue = schema[schemaKey];

        if (schemaKey in object) {
          let valueInObj = object[schemaKey];

          switch (typeof schemaValue) {
            case "object":
              valueInObj = this.getObjectFromSchema(valueInObj, schemaValue);

              if (valueInObj === null) {
                valueInObj = {};
              }
              break;
            default:
              switch (schemaValue) {
                case "boolean":
                  valueInObj = [1, "true", true].indexOf(valueInObj) !== -1;
                  break;
              }
              break;
          }

          if (result === null) {
            result = {};
          }

          result[schemaKey] = valueInObj;
        }
      });
    }

    return result;
  }

  /**
   * Retorna los body params definidos
   * en el esquema
   *
   * @returns {object}
   */
  getBodyParamsFromSchema() {
    let bodyParams = {};

    if (this.bodySchema) {
      bodyParams = this.getObjectFromSchema(this.getBody(), this.bodySchema);

      if (bodyParams === null) {
        bodyParams = {};
      }
    }

    return bodyParams;
  }

}

module.exports = ApiGatewayRequest;
