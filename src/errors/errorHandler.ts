import { NextFunction, Response, Request } from 'express';
import { NotFoundError, BadRequestError, UnauthorizeError, ForbiddenError, PaymentRequiredError } from '@/errors/Errors';

function generateCustomErrorResponse(res: Response, error: any, statusCode: number) {
	return res.status(Number(statusCode)).json({
		error: true,
		statusCode: statusCode,
		message: error.message,
		stack: process.env.NODE_ENV === 'development' && error.stack ? error.stack : {}
	});
}

export default function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
	switch (error.constructor) {
		case BadRequestError:
			return generateCustomErrorResponse(res, error, 400);

		case UnauthorizeError:
			return generateCustomErrorResponse(res, error, 401);

		case PaymentRequiredError:
			return generateCustomErrorResponse(res, error, 402);

		case ForbiddenError:
			return generateCustomErrorResponse(res, error, 403);

		case NotFoundError:
			return generateCustomErrorResponse(res, error, 404);

		default:
			return generateCustomErrorResponse(res, error, 500);
	}
}
