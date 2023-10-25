import { Secret } from 'jsonwebtoken';

// User Model
export enum EUserRoles {
	admin = 'admin',
	user = 'user'
}

export interface IUser {
	id: number;
	first_name: string;
	last_name: string;
	username: string;
	email: string;
	password: string;
	role: EUserRoles;
	last_connected?: string | Date | number | any;

	// Statistic
	jwt_ac_token?: Secret;
	jwt_rf_token?: Secret;
	created_at?: Date | number | string | any;
	updated_at?: Date | number | string | any;
}
// // Functions
// comparePassword(password: string): boolean;
// setJwtTokens(accessToken: string, refreshToken: string): void;
// deleteAcToken(): void;
