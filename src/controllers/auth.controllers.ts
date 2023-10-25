import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '@/models/user.models';
import errorHandler from '@/errors/errorHandler';
import errorHandlerYup from '@/errors/errorHandlerYup';
import { NotFoundError, UnauthorizeError } from '@/errors/Errors';
import AuthValidator from '@/validators/authRequests.schema';

async function register(req: Request, res: Response, next: NextFunction) {
	try {
		await AuthValidator.registerRequestSchema.validate(req.body, { abortEarly: false });
		const { username } = req.body;

		const user = await User.findOneByUsername(username);
		if (user) return next(new NotFoundError('Username is already exists'));
		const newUser = await User.register(req.body);

		res.status(201).send({ error: false, message: 'Register Successful', isAuthenticated: false, user: newUser });
	} catch (error: any) {
		if (error.name === 'ValidationError') {
			return errorHandlerYup(error, req, res, next);
		}
		if (error.name) {
			return errorHandler(error, req, res, next);
		}
		console.log(error);
	}
}

async function login(req: Request, res: Response, next: NextFunction) {
	try {
		await AuthValidator.loginRequestSchema.validate(req.body, { abortEarly: false });
		const { username, password } = req.body;

		const user = await User.findOneByUsername(username);
		if (!user) return next(new NotFoundError('Username is not exists'));
		delete user.jwt_ac_token;
		delete user.jwt_rf_token;

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return next(new NotFoundError('something went wrong'));

		const token = await User.login(user.id, user.role);
		delete user.password;
		res.status(200).json({ error: false, message: 'Login Successful', isAuthenticated: true, user, ac_token: token.accessToken, rf_token: token.refreshToken });
	} catch (error: any) {
		if (error.name === 'ValidationError') {
			return errorHandlerYup(error, req, res, next);
		}
		if (error.name) {
			return errorHandler(error, req, res, next);
		}
		console.log(error);
	}
}

async function isLogin(req: Request, res: Response, next: NextFunction) {
	try {
		const authHeader = req.headers['authorization'];
		const token = authHeader?.split(' ')[1];
		if (!token) return next(new UnauthorizeError('No token provided'));
		const user = await User.isLogin(token);
		delete user?.password;
		res.status(200).send({ error: false, message: 'Is Login User Successful', isAuthenticated: true, user, ac_token: user?.jwt_ac_token, rf_token: user?.jwt_rf_token });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: true, statusCode: 500, message: 'Error From IsLogin' });
	}
}

async function logout(req: Request, res: Response, next: NextFunction) {
	try {
		const { userId } = req.user;
		const authHeader = req.headers['authorization'];
		const token = authHeader?.split(' ')[1];
		if (!token && !userId) return next(new UnauthorizeError('Token And UserID not provided'));

		const findUser = await User.findOneById(parseInt(userId));
		if (!findUser) return next(new NotFoundError('User not found'));
		await User.logout(parseInt(findUser.id));
		res.status(200).send({ error: false, message: 'Logout Successful', isAuthenticated: false });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: true, statusCode: 500, message: 'Error From logout' });
	}
}

export default { register, login, isLogin, logout };
