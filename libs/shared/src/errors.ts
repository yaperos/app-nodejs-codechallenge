import type { RouterContext } from "@koa/router";
import { ZodError } from "zod";

export type ApiErrorProps = {
  message?: string;
  statusCode?: number;
  headers?: RouterContext["headers"];
  body?: unknown;
};

export class ApiError extends Error {
  statusCode: number;
  headers?: RouterContext["headers"];
  body?: unknown;

  static from(e: unknown): ApiError {
    if (e instanceof ApiError) {
      return e;
    }

    if (e instanceof ZodError) {
      return new BadRequestError({
        message: e.message,
        body: e.issues,
      });
    }

    return new ApiError({
      message: e instanceof Error ? e.message : e ? String(e) : undefined,
      statusCode: 500,
    });
  }

  constructor(params: ApiErrorProps) {
    super(params.message || "Internal Server Error");
    this.statusCode = params.statusCode ?? 500;
    this.headers = params.headers;
    this.body = params.body;
  }

  toApi() {
    const error = this.body || this.message;
    return { errors: Array.isArray(error) ? error : [error] };
  }

  toJSON() {
    return {
      message: this.message,
      statusCode: this.statusCode,
      headers: this.headers,
      body: this.body,
    };
  }
}

export class BadRequestError extends ApiError {
  constructor(params: Omit<ApiErrorProps, "statusCode">) {
    super({ statusCode: 400, ...params });
  }
}

export class NotFoundError extends ApiError {
  constructor(params: Omit<ApiErrorProps, "statusCode">) {
    super({ statusCode: 404, ...params });
  }
}
