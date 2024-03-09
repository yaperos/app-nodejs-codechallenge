import { Request, Response, NextFunction, RequestHandler } from 'express';
import { CustomError } from "../helpers/customError.helper";

export const errorHandler = async ( error: CustomError, req: Request, res: Response, _next: NextFunction ) => {
  res.status( error.code || 500 ).json( {
    message: `Error: ${error.message}`
  } );
} ;

export const asyncHandler = ( fn: RequestHandler ) => ( req: Request, res: Response, next: NextFunction ) =>
    Promise
    .resolve( fn( req, res, next ) )
    .catch( next );