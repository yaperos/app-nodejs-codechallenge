import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
    private readonly envConfig: {[key: string]: string}
    
    constructor(filePath: string) {
        this.envConfig = dotenv.parse(fs.readFileSync(filePath));
    }

    get(key: string): string {
        console.log(key+': '+this.envConfig[key]);
        return this.envConfig[key];
    }
}