import { ErrorResponse, LogErrorObjectResponse, LogInfoObjectResponse, MetaErrorObject,MetaInfoObject } from "../response";
import { Logger } from "winston";

export class LogsOptions {
    public static error(_logger: Logger, _status:number, _detail:string, _objError:ErrorResponse): Logger {
        const logError = new LogErrorObjectResponse();
        const metalogError = new MetaErrorObject();
        
        logError.message = `status: ${_status}, ${_detail} ${(_objError["invalid-params"] ? ', Invalid Params.' : '.')}`;
        metalogError.status = _status;
        metalogError.error = _objError;
        logError.meta = metalogError;
        return _logger.error(logError);
    }

    public static errorWithId(_logger: Logger, _id:string, _status:number, _objError:ErrorResponse): Logger{
        const logError = new LogErrorObjectResponse();
        const metalogError = new MetaErrorObject();

        logError.message = `Id-Transaccion: ${_id}, status: ${_status}, response: ${_objError.title}`;
        metalogError["Id-Transaccion"] = _id;
        metalogError.status = _status;
        metalogError.error = _objError;
        logError.meta = metalogError;
        return _logger.error(logError);
    }

    public static infoWithId(_logger: Logger, _id:string, _message:string, _status?:number, _response?: string): Logger {
        const metalogInfo = new MetaInfoObject();
        const logInfo = new LogInfoObjectResponse();

        logInfo.message = `Id-Transaccion: ${_id}, ${_message}`;
        
        if (_status || _response) {
            metalogInfo["Id-Transaccion"] = _id;
            metalogInfo.status = _status;
            metalogInfo.response = _response;
            logInfo.meta = metalogInfo;
        }
        
        return _logger.info(logInfo);
    }

    public static info(_logger: Logger, _message:string, _status:number): Logger {
        const logInfo = new LogInfoObjectResponse();

        logInfo.message = `status: ${_status}, ${_message}`;
        return _logger.info(logInfo);
    }

}