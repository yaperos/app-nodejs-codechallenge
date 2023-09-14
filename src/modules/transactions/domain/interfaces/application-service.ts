export interface ApplicationService {
  process(command: any): Promise<any>;
}
