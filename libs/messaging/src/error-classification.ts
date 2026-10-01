// Error que no vale la pena reintentar (payload inválido): va directo a la DLQ.
export class NonRetriableError extends Error {}

const NETWORK_CODES = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EAI_AGAIN',
  'EPIPE',
]);

// SQLSTATE de Postgres: clase 08 = conexión; 57P01-03 = servidor apagándose o
// arrancando; 53300 = sin conexiones disponibles.
const PG_TRANSIENT = /^(08|57P0[123]|53300)/;

const TRANSIENT_MESSAGE =
  /connection terminated|timeout exceeded when trying to connect|connection refused/i;

// Transitorio = la infraestructura está caída, no el mensaje. Esos errores se
// reintentan sin límite: mandar a la DLQ un mensaje válido lo dejaría colgado.
export function isTransientError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const e = error as Error & {
    code?: string;
    retriable?: boolean;
    driverError?: { code?: string; message?: string };
    cause?: unknown;
  };
  const code = e.code ?? e.driverError?.code;
  if (e.retriable === true) return true; // KafkaJSError
  if (code && (NETWORK_CODES.has(code) || PG_TRANSIENT.test(code))) return true;
  if (TRANSIENT_MESSAGE.test(e.message)) return true;
  if (e.driverError?.message && TRANSIENT_MESSAGE.test(e.driverError.message))
    return true;
  return e.cause !== undefined && isTransientError(e.cause);
}
