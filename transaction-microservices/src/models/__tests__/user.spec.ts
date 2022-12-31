import { User } from '..';

describe('User Model', () => {
  test('should map the properties correctly', async () => {
    const user = await User.query().insert({
      name: 'Test name',
      email: 'test1@yopmail.com',
      password: 'passwordtest',
      role_id: 1
    });

    expect(user.name).toBe('Test name');
    expect(user.email).toBe('test1@yopmail.com');
    expect(user.password).toBe('passwordtest');
    expect(user.role_id).toBe(1);
  });

  test('should have relation mapping', () => {
    expect(User.relationMappings).toHaveProperty('role');
  });
});
