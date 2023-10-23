import dotenv from 'dotenv';

dotenv.config();

const mongoUsername = process.env.MONGO_USERNAME ?? '';
const mongoPassword = process.env.MONGO_PASSWORD ?? '';
const mongoDbName = process.env.MONGO_DBNAME ?? '';
const mongoUrl = `mongodb+srv://${mongoUsername}:${mongoPassword}@api-cluster.bygfo7w.mongodb.net/${mongoDbName}`;

const serverPort = process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000;

export const config = {
	mongo: {
		url: mongoUrl,
	},
	server: {
		port: serverPort,
	},
};
