import app from '../../app';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';

import factories from '../../factories';
import { User } from '../../models';

const server = app.listen();

afterAll(() => server.close());

describe('UserController', () => {
  describe('List', () => {
    test('should list all users', async () => {
      const sampleSize = 3;
      const users = factories.user.buildList(sampleSize);
      await Promise.all(
        users.map(async (data) => (await User.query().insert(data)).id)
      );

      const response = await request(server).get('/users');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('Get', () => {
    test('should get a user correctly', async () => {
      const user = factories.user.build();
      const { id } = await User.query().insert(user);

      const response = await request(server).get(`/users/${id}`);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.id).toBe(id);
    });

    test("should return 404 if user doesn't exists", async () => {
      const response = await request(server).get(`/users/9999`);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('Create', () => {
    test('should create a new user correctly', async () => {
      const user = factories.user.build();
      const response = await request(server).post(`/users`).send(user);
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body.name).toBe(user.name);
    });
  });

  describe('Update', () => {
    test('should update a user correctly', async () => {
      const user = factories.user.build();
      const postResponse = await request(server)
        .post(`/users`)
        .send(user);
      expect(postResponse.status).toBe(StatusCodes.CREATED);

      const newUserData = factories.user.build();
      const putResponse = await request(server)
        .put(`/users/${postResponse.body.id}`)
        .send(newUserData);

      expect(putResponse.status).toBe(StatusCodes.OK);
    });

    test("should return 404 if user doesn't exists", async () => {
      const response = await request(server).put(`/users/9999`);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('Delete', () => {
    test('should delete a user correctly', async () => {
      const user = factories.user.build();
      const { id } = await User.query().insert(user);

      const getResponse = await request(server).get(`/users/${id}`);
      expect(getResponse.body.id).toBe(id);

      const deleteResponse = await request(server).delete(`/users/${id}`);
      expect(deleteResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    test("should return 404 if user doesn't exists", async () => {
      const response = await request(server).delete(`/users/9999`);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
  
});
