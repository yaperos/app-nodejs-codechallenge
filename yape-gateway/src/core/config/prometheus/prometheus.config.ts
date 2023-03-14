import {
  makeHistogramProvider,
  makeCounterProvider,
} from '@willsoto/nestjs-prometheus';

export const prometheusProvider = [
  makeHistogramProvider({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['route', 'method', 'code'],
    // buckets for response time from 0.1ms to 500ms
    buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
  }),
  makeCounterProvider({
    name: 'http_request_total',
    help: 'Total of HTTP request',
    labelNames: ['route', 'method', 'code'],
  }),
  makeHistogramProvider({
    name: 'http_response_size_bytes',
    help: 'Size in bytes of response',
    labelNames: ['route', 'method', 'code'],
    buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
  }),
  makeHistogramProvider({
    name: 'http_request_size_bytes',
    help: 'Size in bytes of request',
    labelNames: ['route', 'method', 'code'],
    buckets: [0.1, 5, 15, 50, 100, 200, 300, 400, 500],
  }),
];
