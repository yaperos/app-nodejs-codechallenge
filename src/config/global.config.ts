import { registerAs } from '@nestjs/config';

export default registerAs('global', () => ({
  country: process.env.COUNTRY,
  country_code: process.env.COUNTRY_CODE,
  time_zone: process.env.TIME_ZONE,
  internal_ms_url: process.env.INTERNAL_MICROSERVICES_URL
}));
