export interface ResponseDTO {
  success: boolean;
  message: string;
  data?: any;
}

export const createSuccessResponse = (message: string, data?: unknown): ResponseDTO => {
  return { success: true, message, data };
}

export const createErrorResponse = (message: string, data?: unknown): ResponseDTO => {
  return { success: false, message, data };
}