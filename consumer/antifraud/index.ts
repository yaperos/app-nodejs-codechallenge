import { APPROVED_CODE, REJECTED_CODE } from "../config";
import { StatusCodes } from "../types/statusCodes";

export const getStatusCodeByValue = (value: any): StatusCodes => {
  if (typeof value !== "number" || value <= 0 || value > 1000) return REJECTED_CODE;

  return APPROVED_CODE;
};
