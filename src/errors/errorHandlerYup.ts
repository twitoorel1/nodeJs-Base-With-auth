import { ValidationError } from 'yup';
import { NextFunction, Request, Response } from 'express';

interface YupError {
	path: string | undefined;
	message: string;
}

const errorHandlerYup = (err: ValidationError, req: Request, res: Response, next: NextFunction) => {
	if (err instanceof ValidationError) {
		const errors: YupError[] = [];

		err.inner.forEach(e => {
			errors.push({
				path: e.path,
				message: e.message
			});
		});

		return res.status(400).json({ errors });
	}

	return next(err);
};

export default errorHandlerYup;
