import moment, {Moment} from "moment";

export default class DateUtil {
    static getCurrentDate() {
        const now: Moment = moment();

        return {
            date: now.format('YYYY-MM-DD'),
            dateTime: now.format("YYYY-MM-DD HH:mm:ss"),
            timestamp: now.valueOf(),
        }
    }
}