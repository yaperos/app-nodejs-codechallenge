import { Test, TestingModule } from '@nestjs/testing';

/* Project */
import { BaseResolver } from './base.resolver';

describe('BaseResolver', () => {
  let resolver: BaseResolver;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [BaseResolver],
    }).compile();

    resolver = moduleRef.get(BaseResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('ping', () => {
    it("should return 'pong'", () => {
      expect(resolver.ping()).toBe('pong');
    });
  });

  describe('hello', () => {
    it("should return 'Hello from GraphQL'", () => {
      expect(resolver.hello()).toBe('Hello from GraphQL');
    });
  });
});
