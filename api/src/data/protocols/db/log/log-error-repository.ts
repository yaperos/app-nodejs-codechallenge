export interface ILogErrorRepository {
	logError(stack: string): Promise<void>;
}
