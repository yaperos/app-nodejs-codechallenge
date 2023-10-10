import { NextFunction, Request, Response, Router } from 'express';
import { validationResult } from 'express-validator';
import glob from 'glob';

export function registerRoutes(router: Router): void {
	const routes = glob.sync(`${__dirname}/**/*.route.*`);
	routes.map(route => register(route, router));
}

async function register(routePath: string, router: Router) {
	const { register } = require(routePath) as { register: (router: Router) => void };
	register(router);
}

export function validateReqSchema(req: Request, res: Response, next: NextFunction): any {
	const validationErrors = validationResult(req);
	if (validationErrors.isEmpty()) {
		next();

		return;
	}
	const errors = validationErrors.array({ onlyFirstError: true }).map((err: any) => ({ [err.path]: err.msg }));

	return res.status(422).json({
		errors
	});
}
