export interface UseCase<T, K> {
  run(request?: T): Promise<K> | K;
}
