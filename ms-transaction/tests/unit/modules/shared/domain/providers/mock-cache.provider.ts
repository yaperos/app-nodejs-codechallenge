import { CacheProvider } from 'src/modules/shared/domain/providers/cache.provider';

export class MockCacheProvider implements CacheProvider {
  private mockGet = jest.fn();
  private mockSet = jest.fn();
  private mockDelete = jest.fn();

  private data: any;

  returnOnGet(data: any) {
    this.data = data;
  }

  async get(key: string): Promise<any> {
    this.mockGet(key);
    return this.data;
  }

  assertGetHasBeenCalledWith(key: string) {
    expect(this.mockGet).toHaveBeenCalledWith(key);
  }

  async set(key: string, data: any): Promise<void> {
    this.mockSet(key, data);
  }

  assertSetHasBeenCalledWith(key: string, data: any) {
    expect(this.mockSet).toHaveBeenCalledWith(...[key, data]);
  }

  async delete(key: string): Promise<void> {
    this.mockDelete(key);
  }

  assertDeleteHasBeenCalledWith(key: string) {
    expect(this.mockDelete).toHaveBeenCalledWith(key);
  }
}
