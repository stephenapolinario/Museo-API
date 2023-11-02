import dotenv from 'dotenv';

dotenv.config();

const mongoUsername = process.env.MONGO_USERNAME ?? '';
const mongoPassword = process.env.MONGO_PASSWORD ?? '';
const mongoDbName = process.env.MONGO_DBNAME ?? '';
const mongoUrl = `mongodb+srv://${mongoUsername}:${mongoPassword}@api-cluster.bygfo7w.mongodb.net/${mongoDbName}`;

const emailServerUser = process.env.EMAIL_SERVER_USER ?? '';
const emailServerPassword = process.env.EMAIL_SERVER_PASSWORD ?? '';
const emailServerPort = process.env.EMAIL_SERVER_PORT ?? '';
const emailServerHost = process.env.EMAIL_SERVER_HOST ?? '';

const serverPort = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;

export const config = {
	mongo: {
		url: mongoUrl,
	},
	server: {
		port: serverPort,
	},
	emailServer: {
		host: emailServerHost,
		port: emailServerPort,
		email: emailServerUser,
		password: emailServerPassword,
	},
};
