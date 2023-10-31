export default interface PersistenceRepository<T> {
  save: (t: T) => Promise<T>
  findAll: () => Promise<T[]>
}
