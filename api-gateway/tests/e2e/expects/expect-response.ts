import { expect } from '@jest/globals';
import { Response } from 'supertest';

export const expectTypeJson = (res: Response) => {
  expect(res.type).toEqual('application/json');
};

export const expectTypeEmpty = (res: Response) => {
  expect(res.type).toEqual('');
};

export const expectOk = (res: Response) => {
  expect(res.statusCode).toEqual(200);
};

export const expectOkCreated = (res: Response) => {
  expect(res.statusCode).toEqual(201);
};

export const expectBadRequest = (res: Response) => {
  expect(res.statusCode).toEqual(400);
};

export const expectNotFound = (res: Response) => {
  expect(res.statusCode).toEqual(404);
};

export const expectUnprocessableContent = (res: Response) => {
  expect(res.statusCode).toEqual(422);
};

export const expectServerError = (res: Response) => {
  expect(res.statusCode).toEqual(500);
};
