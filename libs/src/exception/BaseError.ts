import { Domain } from "../domain/Domain";

interface BaseErrorProps {
  message: string;
  statusCode: number;
}

export class BaseError extends Error implements Domain {
  message: string;
  statusCode: number;

  constructor(props: BaseErrorProps) {
    super(props.message);
    this.statusCode = props.statusCode;
  }

  getApiData() {
    return {
      statusCode: this.statusCode,
      message: this.message,
      stack: this.stack,
    };
  }

  getEventData() {
    return {
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}
