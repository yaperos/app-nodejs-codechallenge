export class Error {
	// For end users
	error: string;
	// For developers
	reason: any;

	constructor(error: string, reason: any) {
		this.error = error;
		this.reason = reason;
	}
}