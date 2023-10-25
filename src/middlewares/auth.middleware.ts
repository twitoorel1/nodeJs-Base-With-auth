import { Request, Response, NextFunction } from 'express';
import { JsonWebTokenError, JwtPayload, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import { UnauthorizeError } from '@/errors/Errors';
import { createAccessToken, createRefreshToken, verifyAccessToken, verifyRefreshToken } from '@/services/jwt.services';
import { EUserRoles, IUser } from '@/types/auth.types';
import User from '@/models/user.models';
import queryDatabase from '@/database/queryDatabase';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers['authorization'];
	if (!authHeader) return res.status(401).json({ error: 'No token provided' });
	const token = authHeader.split(' ')[1];

	try {
		let decoded = verifyAccessToken(token) as JwtPayload;
		if (!decoded) return res.status(401).json({ error: 'Invalid token Error Decoded' });

		// בדוק אם הטוקן עדיין קיים במסד הנתונים
		const user = (await User.findOneById(Number(decoded.userId))) as IUser;
		if (!user) return res.status(404).json({ error: 'User not found' });
		if (!user || user.jwt_ac_token === null || user.jwt_ac_token !== token) {
			// המשתמש לא קיים או שהטוקן נמחק
			return res.status(401).json({ error: 'Token is no longer valid' });
		}

		req.user = decoded;
		return next();
	} catch (error) {
		if (error instanceof TokenExpiredError) {
			return res.status(401).json({ error: 'Token has expired', action: 'refreshToken' });
		}
		if (error instanceof NotBeforeError) {
			return res.status(401).json({ error: 'Token not active yet' });
		}
		if (error instanceof JsonWebTokenError) {
			return res.status(401).json({ error: 'Invalid token' });
		} else {
			return res.status(500).json({ error: 'An error occurred while authenticating' });
		}
	}
};

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	const { refreshToken } = req.body;
	if (!refreshToken) return res.status(401).json({ error: 'No refresh token provided' });
	const query = `UPDATE users SET jwt_ac_token = ?, jwt_rf_token = ? WHERE id = ?`;

	try {
		const decoded = verifyRefreshToken(refreshToken) as JwtPayload;
		const user = (await User.findOneById(Number(decoded.userId))) as IUser;

		if (!user || user.jwt_rf_token === null || user.jwt_rf_token !== refreshToken) {
			return res.status(401).json({ error: 'Refresh token is no longer valid' });
		}

		const newAccessToken = createAccessToken(decoded.userId, decoded.role);
		const newRefreshToken = createRefreshToken(decoded.userId, decoded.role);
		await queryDatabase(query, [newAccessToken, newRefreshToken, Number(decoded.userId)]);

		return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
	} catch (error: any) {
		if (error instanceof JsonWebTokenError) {
			return res.status(401).json({ error: '{JsonWebTokenError} - Invalid token' });
		} else {
			return res.status(500).json({ error: 'An error occurred while refreshing token', msg: error });
		}
	}
};

export const authRole = (...roles: string[]) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		if (!req.user || !req.user.role) {
			// המשתמש או התפקיד לא מוגדרים
			return next(new UnauthorizeError('User or Role not defined'));
		}
		if (req.user.role === EUserRoles.admin || roles.includes(req.user.role)) {
			return next();
		}
		return next(new UnauthorizeError('You do not have access to this route'));
	};
};
