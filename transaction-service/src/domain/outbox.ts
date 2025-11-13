export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | { [k: string]: JsonValue } | JsonValue[];


export interface OutboxMessage {
  id?: string;
  topic: string;
  key: string;
  payload: JsonValue;
  createdAt?: Date;
  publishedAt?: Date | null;
  attempts?: number;
  nextAttemptAt?: Date;
}
