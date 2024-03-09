export class CustomError extends Error {
    public readonly code: number;
    public readonly fn?: string;
  
    constructor ( message: string, code: number, fn?: string ) {
      super( message ),
      this.code = code;
      this.fn = fn;
    }
  }
  
  