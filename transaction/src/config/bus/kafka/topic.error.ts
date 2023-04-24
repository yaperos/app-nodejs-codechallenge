export class TopicError extends Error {
  constructor(name: string) {
    super(`Topic for "${name}" event isnt mapped.`);
  }
}
