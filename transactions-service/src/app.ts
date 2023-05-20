import Express, { Application } from 'express';

export class App {
  private app: Application;

  // eslint-disable-next-line no-unused-vars
  constructor(private port?: number | string) {
    this.app = Express();
    this.settings();
  }

  settings() {
    this.app.set('port', this.port || process.env.PORT || 3000);
  }

  start() {
    const port = this.app.get('port');
    this.app.listen(port);
    console.info('App running on port', port);
  }
}
