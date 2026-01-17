import crypto from "crypto";
import { stableJson } from "@yape/contracts/src";

export function sha256(input: string) {
    return crypto.createHash("sha256").update(input).digest("hex");
}

export function requestHash(body: unknown) {
    return sha256(stableJson(body));
}
