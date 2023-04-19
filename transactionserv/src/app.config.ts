export class AppConfig {
    port: number;
    allowedOrigins: string[];
    globalPrefix: string;
  
    constructor() {
      this.port = parseInt(process.env.PORT, 10) || 3000;
      this.allowedOrigins = ['http://localhost:3000'];
      this.globalPrefix = 'api';
    }
  }
  