import mysql2, { ResultSetHeader, PoolConnection } from 'mysql2/promise';
import pool from './db';

interface MyCustomOkPacket {
	affectedRows: number;
	fieldCount: number;
	info: string;
	insertId: number;
	serverStatus: number;
	warningStatus: number;
}

export type QueryResult = mysql2.RowDataPacket[] | mysql2.RowDataPacket[][] | mysql2.ResultSetHeader | MyCustomOkPacket;

export async function queryDatabase(query: string, values?: any[]): Promise<any> {
	let connection: PoolConnection | undefined;
	try {
		connection = await pool.getConnection();
		const [results, _] = await connection.execute(query, values);
		connection.release();
		if (results.constructor.name === 'ResultSetHeader') {
			const okPacketResults = results as unknown as ResultSetHeader;
			const customResults: MyCustomOkPacket = {
				affectedRows: okPacketResults.affectedRows,
				fieldCount: okPacketResults.fieldCount,
				info: okPacketResults.info,
				insertId: okPacketResults.insertId,
				serverStatus: okPacketResults.serverStatus,
				warningStatus: okPacketResults.warningStatus
			};
			return customResults;
		}
		return results;
	} catch (error) {
		if (connection) connection.release();
		throw error;
	}
}

export default queryDatabase;
