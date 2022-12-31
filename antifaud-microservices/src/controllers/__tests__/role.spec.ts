import app from '../../app';
import request from 'supertest';
import { StatusCodes } from 'http-status-codes';

import factories from '../../factories';
import { Role } from '../../models';

const server = app.listen();

afterAll(() => server.close());

describe('RoleController', () => {
  describe('List', () => {
    test('should list all roles', async () => {
      const sampleSize = 3;
      const roles = factories.role.buildList(sampleSize);
      await Promise.all(
        roles.map(async (data) => (await Role.query().insert(data)).id)
      );

      const response = await request(server).get('/roles');

      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('Get', () => {
    test('should get a role correctly', async () => {
      const role = factories.role.build();
      const { id } = await Role.query().insert(role);

      const response = await request(server).get(`/roles/${id}`);
      expect(response.status).toBe(StatusCodes.OK);
      expect(response.body.id).toBe(id);
    });

    test("should return 404 if role doesn't exists", async () => {
      const response = await request(server).get(`/roles/9999`);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('Create', () => {
    test('should create a new role correctly', async () => {
      const role = factories.role.build();
      const response = await request(server).post(`/roles`).send(role);
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body.name).toBe(role.name);
    });
  });

  describe('Update', () => {
    test('should update a role correctly', async () => {
      const role = factories.role.build();
      const postResponse = await request(server)
        .post(`/roles`)
        .send(role);
      expect(postResponse.status).toBe(StatusCodes.CREATED);

      const newRoleData = factories.role.build();
      const putResponse = await request(server)
        .put(`/roles/${postResponse.body.id}`)
        .send(newRoleData);

      expect(putResponse.status).toBe(StatusCodes.OK);
    });

    test("should return 404 if role doesn't exists", async () => {
      const response = await request(server).put(`/roles/9999`);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });

  describe('Delete', () => {
    test('should delete a role correctly', async () => {
      const role = factories.role.build();
      const { id } = await Role.query().insert(role);

      const getResponse = await request(server).get(`/roles/${id}`);
      expect(getResponse.body.id).toBe(id);

      const deleteResponse = await request(server).delete(`/roles/${id}`);
      expect(deleteResponse.status).toBe(StatusCodes.NO_CONTENT);
    });

    test("should return 404 if role doesn't exists", async () => {
      const response = await request(server).delete(`/roles/9999`);
      expect(response.status).toBe(StatusCodes.NOT_FOUND);
    });
  });
  
});
