export interface CreateUserPayload {
  email: string;
  password: string;
  name: string;
  lastname: string;
}

export class CreateUserDTO {
  requestId: string;
  payload: CreateUserPayload;
}
