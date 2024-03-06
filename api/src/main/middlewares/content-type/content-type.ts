import { Request, Response, NextFunction } from 'express';

export const contentType = (_: Request, response: Response, next: NextFunction): void => {
	response.type('json');

	next();
};
