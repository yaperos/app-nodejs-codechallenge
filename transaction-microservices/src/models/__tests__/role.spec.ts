import { Role } from '..';

describe('Role Model', () => {
  test('should map the properties correctly', async () => {
    const user = await Role.query().insert({
      name: 'Test role',
    });

    expect(user.name).toBe('Test role');
  });
});
