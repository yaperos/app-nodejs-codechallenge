import {v4} from "uuid";

export default class UuidUtil {
    static getId(): string {
        return v4()
    }
}