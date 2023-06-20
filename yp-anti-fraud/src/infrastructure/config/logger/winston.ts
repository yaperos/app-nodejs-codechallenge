import winston, { transports, format } from 'winston'
import etc from '../../../libs/etc'
import env from '../env/env';

const consoleFormat = (stage: string) => {
    if (stage != etc.Stages.Prod){
        return format.combine(
            format.colorize(),
            format.simple()
        )
    }

    return format.combine(
        format.uncolorize(),
        format.json()
    )
}

const Logger = winston.createLogger({
    level: env.Log.Level,
    format: consoleFormat(env.App.Stage),
    transports: [
        new transports.Console(),
    ]
});

if (env.Log.EnableFile) {
    Logger.add(new transports.File({
        filename: env.Log.Filename,
        format: format.combine(
            format.uncolorize(),
            format.json(),
        ),
    }));
}

export default Logger;