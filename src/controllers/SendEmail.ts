import { Response } from 'express';
import { createTransport } from 'nodemailer';
import { config } from '../config/config';
import Logging from '../library/Logging';

const SendEmail = (userEmail: string, code: string, res: Response) => {
	return new Promise((resolve, reject) => {
		const transporter = createTransport({
			host: config.emailServer.host,
			port: parseInt(config.emailServer.port),
			secure: false,
			requireTLS: true,
			auth: {
				user: config.emailServer.email,
				pass: config.emailServer.password,
			},
		});

		const mailOptions = {
			from: config.emailServer.email,
			to: userEmail,
			subject: 'MOVI - Atualize sua senha',
			html: `<p> Olá! Por favor, copie o código abaixo e cole na aba "Já possuo um código" dentro do aplicativo<br>Seu código: <b>${code}</b></p>`,
		};

		transporter.sendMail(mailOptions, (err, inf) => {
			if (err) {
				Logging.warn(err);
				reject(err);
			} else {
				resolve(inf);
			}
		});
	});
};

export default SendEmail;
