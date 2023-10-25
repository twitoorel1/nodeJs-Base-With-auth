import { IUser } from './auth.types';

export interface IDatabaseConfig {
	host: string;
	user: string;
	password: string;
	database: string;
}

// Global
declare module 'express' {
	interface Request {
		user?: IUser | string | object | null | undefined | any;
	}
}
