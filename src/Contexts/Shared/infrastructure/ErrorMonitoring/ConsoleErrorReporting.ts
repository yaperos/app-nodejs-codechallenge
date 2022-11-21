import { ErrorReporting } from '../../domain/ErrorReporting';

export class ConsoleErrorReporting implements ErrorReporting {
  notify(error: Error): void {
    console.log('****** ERROR ******');
    console.log(error);
    console.log('************');
  }
}
