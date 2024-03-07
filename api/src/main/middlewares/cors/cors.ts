import { Request, Response, NextFunction } from 'express';

export const cors = (_: Request, response: Response, next: NextFunction): void => {
	response.set('access-control-allow-origin', '*');
	response.set('access-control-allow-headers', '*');
	response.set('access-control-allow-methods', '*');
	next();
};
