const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

export class DateAdapter {

	/**
	 * Returns the current timestamp in UTC format YYYY-MM-DDThh:mm:ssZ
	 * @returns string
	 */
	public static nowUTC(): string {
		return dayjs.utc().format();
	}
};