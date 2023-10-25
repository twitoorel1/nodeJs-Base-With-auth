import mysql2, { Pool, PoolConnection } from 'mysql2/promise';
import config from 'config';
import { IDatabaseConfig } from '@/types/global';

const dbConfig = config.get<IDatabaseConfig>('database');
const pool: Pool = mysql2.createPool({
	host: dbConfig.host,
	user: dbConfig.user,
	password: dbConfig.password,
	database: dbConfig.database
});

export async function connectToDatabase() {
	let connection: PoolConnection | undefined;

	try {
		connection = await pool.getConnection();
		console.log('Successfully obtained a connection from the pool!');
		connection.release();
	} catch (err) {
		console.error('Failed to get a connection from the pool:', err);
		throw err;
	}
}

export default pool;
