import jwt, { JwtPayload } from 'jsonwebtoken';

const jwtConfig = {
	ac_secret: `${process.env.JWT_ACCESS_TOKEN_SECRET}`,
	rf_secret: `${process.env.JWT_REFRESH_TOKEN_SECRET}`,
	ac_expired_millisecond: process.env.JWT_ACCESS_TOKEN_EXPIRED_MILLISECONDS // 1 hour
};

export function createAccessToken(userId: string, userRole: string) {
	const payload: JwtPayload = { userId, userRole };
	return jwt.sign(payload, jwtConfig.ac_secret, { expiresIn: '5h' }); // Added expiration
}

export function createRefreshToken(userId: string, userRole: string) {
	const payload: JwtPayload = { userId, userRole };
	return jwt.sign(payload, jwtConfig.rf_secret, { expiresIn: '7d' }); // Different secret and longer expiration
}

export const verifyAccessToken = (token: string): string | JwtPayload => {
	return jwt.verify(token, jwtConfig.ac_secret) as JwtPayload;
};

export const verifyRefreshToken = (token: string): string | JwtPayload => {
	return jwt.verify(token, jwtConfig.rf_secret) as JwtPayload;
};
