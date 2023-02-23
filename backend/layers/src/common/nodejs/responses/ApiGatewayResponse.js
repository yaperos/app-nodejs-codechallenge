"use strict";

const { RESPONSE_STATUS_CODES } = require("../constants/LambdaConstants")

class ApiGatewayResponse {
  /**
   * Método para formatear la respuesta para Api GW
   *
   * @param {int} statusCode Código de estado HTTP
   * @param {object} body Objeto con body de respuesta
   * @param {object} headers Objeto con encabezados de respuesta
   *
   * @returns {object}
   */
  static format(statusCode, body, headers) {
    const defaultHeaders = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "",
      "Access-Control-Allow-Methods": "POST, PUT, GET, PATCH",
      "Access-Control-Allow-Origin": "*",
    };

    if (typeof headers === "undefined") {
      headers = defaultHeaders;
    } else {
      headers = { ...headers, ...defaultHeaders };
    }

    return {
      statusCode: statusCode,
      body: JSON.stringify(body),
      headers: headers,
    };
  }

  /**
   * Método para gestionar una excepción y devolverla como repsuesta a api GW
   *
   * @param {*} e Excepción a gestionar
   *
   * @returns {object}
   */
  static handleException(e) {
    let httpStatusCode = RESPONSE_STATUS_CODES.INTERNAL_SERVER_ERROR;
    let code = e.code;
    let message = e.message;

    switch (e.httpStatusCode) {
      case RESPONSE_STATUS_CODES.BAD_REQUEST:
      case RESPONSE_STATUS_CODES.NOT_FOUND:
        httpStatusCode = e.httpStatusCode;
        break;
      default:
        code = "EPR500";
        message = "an unexpected error has occurred";
        break;
    }


    return ApiGatewayResponse.format(httpStatusCode, {
      code: code,
      message: message,
    });
  }
}

module.exports = ApiGatewayResponse;
