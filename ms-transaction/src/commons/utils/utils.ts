import {DatabaseConfig} from '../../domain/constants/Database'

export default class Utils {
    public buildURI = ()=>{
        const driver = process.env.DBDRIVER || DatabaseConfig.DB_DRIVER;
        const name = process.env.DBDRIVER || DatabaseConfig.DB_NAME;
        const user = process.env.DBDRIVER || DatabaseConfig.USER_DEFAULT;
        const pass = process.env.DBDRIVER || DatabaseConfig.PASS_DEFAULT;
        const host = process.env.DBDRIVER || DatabaseConfig.HOST_DEFAULT;
        return `${driver}://${user}:${pass}@${host}/${name}`;
    }
}