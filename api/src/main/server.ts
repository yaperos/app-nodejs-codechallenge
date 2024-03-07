import app from './config/app';
import { serverConfig } from '@shared/config/server';

app.listen(serverConfig.serverPort, () =>
	console.log(`Server running at http://localhost:${serverConfig.serverPort}`)
);
