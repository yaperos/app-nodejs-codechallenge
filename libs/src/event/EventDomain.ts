import type { IncomingHttpHeaders } from "node:http";

export enum EventAction {
  REQUEST = "request",
  CREATE = "create",
  UPDATE = "update",
}

export enum EventType {
  DONE = "done",
  FAILED = "failed",
}

export interface EventMetadata {
  namespace?: string;
}

export type HttpEvent = {
  method: string;
  routerPath: string;
  params?: Record<string, string>;
  query?: Record<string, string>;
  headers?: IncomingHttpHeaders;
  body?: Record<string, unknown>;
};
