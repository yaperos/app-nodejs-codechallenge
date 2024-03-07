import { check, sleep } from 'k6';
import http from 'k6/http';

const APP_URL = __ENV.APP_URL;
const DURATION = __ENV.K6_DURATION;
const MAX_RESPONSE_RATE = __ENV.K6_MAX_RESPONSE_RATE;
const PERCENTIL_RATE = __ENV.K6_PERCENTIL_RATE;
const MAX_RESPONSE_TIME = __ENV.K6_MAX_RESPONSE_TIME;

export const options = {
  stages: [
    { duration: DURATION, target: 1000 },
    { duration: DURATION, target: 2000 },
    { duration: DURATION, target: 3000 },
  ],
  thresholds: {
    http_req_failed: [`rate<${MAX_RESPONSE_RATE}`], // http errors should be less than 1%
    http_req_duration: [`p(${PERCENTIL_RATE})<${MAX_RESPONSE_TIME}`], // 95 percent of response times must be below 50ms
  },
};

export default function () {
  const url = `${APP_URL}/graphql`;
  const query = `
    query Transactions {
      transactions {
        transactionExternalId
        transactionType {
          name
        }
        transactionStatus {
          name
        }
        value
        createdAt
      }
    }
  `
  const payload = JSON.stringify({
    query: query,
  });
  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = http.post(url, payload, params);

  check(response, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}
