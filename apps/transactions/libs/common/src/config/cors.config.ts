import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const corsConfig: CorsOptions = {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'X-Requested-With',
    'Origin',
  ],
  credentials: true,
};

export { corsConfig };
