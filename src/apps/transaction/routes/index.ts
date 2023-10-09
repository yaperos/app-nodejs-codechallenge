import { NextFunction, Request, Response, Router } from 'express';
import { ValidationError, validationResult } from 'express-validator';
import glob from 'glob';

export function registerRoutes(router: Router): void {
	const routes = glob.sync(`${__dirname}/**/*.route.*`);
	routes.map(route => register(route, router));
}

async function register(routePath: string, router: Router) {
	// eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
	const { register } = require(routePath) as { register: (router: Router) => void };
	await register(router);
}

export function validateReqSchema(req: Request, res: Response, next: NextFunction): any {
	const validationErrors = validationResult(req);
	if (validationErrors.isEmpty()) {
		next();

		return;
	}
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const errors = validationErrors.array().map((err: ValidationError) => ({ [err.param]: err.msg }));

	return res.status(422).json({
		errors
	});
}
