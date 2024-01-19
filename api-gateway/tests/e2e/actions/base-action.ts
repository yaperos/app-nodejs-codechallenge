import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { Request, Response } from 'supertest';

export enum Method {
  GET = 'get',
  POST = 'post',
}

export const requestApi = ({
  app,
  method,
  path,
  body,
}: {
  app: INestApplication;
  method: Method;
  path: string;
  body?: any;
}): Promise<Response> => {
  const apiPath = `/api${path}`;
  const httpApp = request(app.getHttpServer());

  let _request: Request;
  if (method === Method.POST) {
    _request = httpApp.post(apiPath).send(body);
  } else {
    _request = httpApp.get(apiPath);
  }

  return _request;
};

export const requestGraphQL = ({
  app,
  query,
  variables,
}: {
  app: INestApplication;
  query: any;
  variables: any;
}): Promise<Response> => {
  const httpApp = request(app.getHttpServer());
  const _request: Request = httpApp.post('/graphql').send(
    JSON.stringify({
      query,
      variables,
    }),
  );
  _request.set({
    'Content-Type': 'application/json',
    Accept: 'application/json',
  });
  return _request;
};
