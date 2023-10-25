import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import config from 'config';

interface ISendEmail {
	from: string | undefined;
	to: string | undefined;
	subject: string;
	html: string;
}

export interface ISendEmailSettings {
	host: string | undefined;
	port: number | undefined;
	auth: {
		user: string | undefined;
		pass: string | undefined;
	};
}

export const sendEmail = async (email: ISendEmail) => {
	let emailService = config.get<ISendEmailSettings>('emailService');
	const transporter: Transporter = nodemailer.createTransport({
		host: emailService.host,
		port: emailService.port,
		secure: false,
		auth: {
			user: emailService.auth.user,
			pass: emailService.auth.pass
		},
		tls: {
			rejectUnauthorized: false
		}
	});

	const mailOptions = { from: email.from, to: email.to, subject: email.subject, html: email.html };
	return await transporter.sendMail(mailOptions as SendMailOptions);
};
