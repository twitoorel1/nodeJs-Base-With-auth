/**
 * Error 400 (Bad Request)
 * @param {TYPE} Message - custom message or message default error
 */
export class BadRequestError extends Error {
	constructor(message?: string) {
		super(message || 'Bad Request');
	}
}

/**
 * Error 401 (Unauthorized)
 * @param {TYPE} Message - custom message or message default error
 */
export class UnauthorizeError extends Error {
	constructor(message?: string) {
		super(message || 'Unauthorize');
	}
}

/**
 * Error 402 (Payment Required)
 * @param {TYPE} Message - custom message or message default error
 */
export class PaymentRequiredError extends Error {
	constructor(message?: string) {
		super(message || 'Payment Required');
	}
}

/**
 * Error 403 (Forbidden)
 * @param {TYPE} Message - custom message or message default error
 */
export class ForbiddenError extends Error {
	constructor(message?: string) {
		super(message || 'Forbidden');
	}
}

/**
 * Error 404 (Not Found)
 * @param {TYPE} Message - custom message or message default error
 */
export class NotFoundError extends Error {
	constructor(message?: string) {
		super(message || 'Not Found');
	}
}

/**
 * Error 500 (Internal Server Error)
 * @param {TYPE} Message - custom message or message default error
 */
export class ServerError extends Error {
	constructor(message?: string) {
		super(message || 'Something went wrong');
	}
}
