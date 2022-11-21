import { ConsoleErrorReporting } from './ConsoleErrorReporting';

export class ErrorReportingManager {
  static notify(error: Error): void {
    const errorReporting = new ConsoleErrorReporting();
    errorReporting.notify(error);
  }
}
