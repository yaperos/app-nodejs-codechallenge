import { APPROVED_CODE, REJECTED_CODE, PENDING_CODE } from "../config";

export type StatusCodes = typeof PENDING_CODE | typeof APPROVED_CODE | typeof REJECTED_CODE;
