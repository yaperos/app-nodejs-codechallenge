import Base from '../base';

test('should contain "/src/models" in modelPaths', () => {
  expect(Base.modelPaths[0]).toContain('src');
  expect(Base.modelPaths[0]).toContain('models');
});
