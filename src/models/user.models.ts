import { RowDataPacket } from 'mysql2/promise';
import queryDatabase from '@/database/queryDatabase';
import { UnauthorizeError } from '@/errors/Errors';
import bcrypt from 'bcrypt';
import { JwtPayload } from 'jsonwebtoken';
import { createAccessToken, createRefreshToken, verifyAccessToken } from '@/services/jwt.services';
import { IUser } from '@/types/auth.types';

const DB_NAME = 'users';

/* CRUD
CREATE - register, login, isLogin
READ - findOneById, findOneByUsername
UPDATE - 
DELETE - 
*/

async function findOneById(id: number) {
	const query = `SELECT * FROM ${DB_NAME} WHERE id =  ?;`;
	try {
		const result = await queryDatabase(query, [id]);
		const user = result as RowDataPacket[];
		// if (!user) throw new UnauthorizeError('User not found');
		if (user.length > 0) return user[0];
		return null;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

async function findOneByUsername(username: string) {
	const query = `SELECT * FROM ${DB_NAME} WHERE username = ?;`;
	try {
		const result = await queryDatabase(query, [username]);
		const user = result as RowDataPacket[];
		if (!user) throw new UnauthorizeError('User not found');
		if (user.length > 0) return user[0];
		return null;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

async function register(body: IUser) {
	const query = `INSERT INTO ${DB_NAME} (first_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?);`;

	try {
		const hashedPassword = await bcrypt.hash(body.password, 10);
		await queryDatabase(query, [body.first_name, body.last_name, body.email, body.username, hashedPassword]);
		return 'User registered successfully';
	} catch (error) {
		console.log(error);
		throw error;
	}
}

async function login(userId: number, userRole: string) {
	const currentDateTime = new Date();
	const query = `UPDATE ${DB_NAME} SET jwt_ac_token = ?, jwt_rf_token = ?, last_connected = ? WHERE id = ?`;

	try {
		const accessToken = createAccessToken(userId.toString(), userRole);
		const refreshToken = createRefreshToken(userId.toString(), userRole);
		await queryDatabase(query, [accessToken, refreshToken, currentDateTime, userId]);
		return { accessToken, refreshToken };
	} catch (error) {
		console.log(error);
		throw error;
	}
}

async function isLogin(token: string) {
	try {
		const { userId } = verifyAccessToken(token) as JwtPayload;
		if (!userId) throw new UnauthorizeError('Invalid token');
		const findUser = await findOneById(+userId);
		return findUser;
	} catch (error) {
		console.log(error);
		throw error;
	}
}

async function logout(id: number) {
	const query = `UPDATE ${DB_NAME} SET jwt_ac_token = NULL, jwt_rf_token = NULL WHERE id = ?;`;

	try {
		return await queryDatabase(query, [id]);
	} catch (error) {
		console.log(error);
		throw error;
	}
}

export default {
	findOneById,
	findOneByUsername,
	register,
	login,
	isLogin,
	logout
};
