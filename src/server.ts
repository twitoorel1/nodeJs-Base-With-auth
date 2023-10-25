import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import 'dotenv/config';
import config from 'config';
import { connectToDatabase } from '@/database/db';
import appRoutes from '@/routes';
import errorHandler from '@/errors/errorHandler';
import moment from 'moment';
import momentTimezone from 'moment-timezone';

const app = express();

// Time Zone
momentTimezone.tz.setDefault('Asia/Jerusalem');
moment.tz.setDefault('Asia/Jerusalem');

// Check if public directory exists
if (!fs.existsSync(path.join(__dirname, 'public'))) {
	fs.mkdirSync(path.join(__dirname, 'public'));
}

// Middlewares
app.use(helmet());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());
app.use(cors({ origin: true, credentials: true }), appRoutes);
app.use(errorHandler);

// Set Port
app.set('port', config.get('port') || 4000);

// Connect to Database and Start Server
connectToDatabase()
	.then(() => {
		app.listen(app.get('port'), () => {
			console.log(`Server is running on port ${app.get('port')}`);
		});
	})
	.catch(err => console.log(`Problems connecting to database: ${err.message}`));
