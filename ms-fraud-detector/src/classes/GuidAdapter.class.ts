const uuid = require('uuid');

export class GuidAdapter {
	
	/**
	 * 
	 * @returns Global unique Id
	 */
	public static create(): string {
		return uuid.v4();
	}

	/**
	 * 
	 * @param {string} guid 
	 * @returns true if parm is a valid guid otherwise false
	 */
	public static isGuid( guid: string ): boolean {
			return uuid.validate(guid);
	}
}