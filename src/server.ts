import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import { config } from './config/config';
import Logging from './library/Logging';
import session from 'express-session';
import userRoutes from './routes/User';
import adminRoutes from './routes/Admin';
import productRoutes from './routes/Product/Product';
import productCategoryRoutes from './routes/Product/Category';
import couponTypeRoutes from './routes/Coupon/Type';
import couponAccessRoutes from './routes/Coupon/Access';
import couponRoute from './routes/Coupon/Coupon';
import ticketRoutes from './routes/Ticket';
import tourRoutes from './routes/Tour';
import beaconRoutes from './routes/Beacon';
import museumPieceRoute from './routes/MuseumPiece';
import quizRoute from './routes/Quiz';
import museumRoute from './routes/MuseumInformation';
import emblemRoute from './routes/Emblem';

const app = express();
const router = express.Router();

const secretKey = process.env.ACCESS_TOKEN_SECRET;
if (!secretKey) {
	Logging.error('There is no acessToken inside .env');
	process.exit(1);
}

// Connect to Mongo
mongoose
	.connect(config.mongo.url, { retryWrites: true, w: 'majority' })
	.then(() => {
		Logging.info('Mongo connected successfully.');
		StartServer();
	})
	.catch((error) => Logging.error(error));

// Only Start Server if Mongoose Connects
const StartServer = () => {
	// Log the request
	router.use((req, res, next) => {
		// Log the reqquests
		Logging.info(
			`Incomming - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`,
		);

		res.on('finish', () => {
			// Log the ressponses
			Logging.info(
				`Result - METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}] - STATUS: [${res.statusCode}]`,
			);
		});

		next();
	});

	router.use(express.urlencoded({ extended: true }));
	router.use(express.json());
	router.use(
		session({
			secret: secretKey,
			resave: false,
			saveUninitialized: true,
		}),
	);
	const version = 'v0';
	// Applying the '/api/version' prefix to every route
	app.use(`/api/${version}`, router);

	// Rules of our API
	router.use((req, res, next) => {
		// TODO -> This line below MUST change?
		res.header('Access-Control-Allow-Origin', '*');
		res.header(
			'Access-Control-Allow-Headers',
			'Origin, X-Requested-With, Content-Type, Accept, Authorization',
		);

		if (req.method == 'OPTIONS') {
			res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
			return res.status(200).json({});
		}

		next();
	});

	// Routes
	router.use('/user', userRoutes);
	router.use('/admin', adminRoutes);
	router.use('/coupon/type', couponTypeRoutes);
	router.use('/coupon/access', couponAccessRoutes);
	router.use('/coupon', couponRoute);
	router.use('/product/category', productCategoryRoutes);
	router.use('/product', productRoutes);
	router.use('/ticket', ticketRoutes);
	router.use('/tour', tourRoutes);
	router.use('/beacon', beaconRoutes);
	router.use('/piece', museumPieceRoute);
	router.use('/quiz', quizRoute);
	router.use('/museumInformation', museumRoute);
	router.use('/emblem', emblemRoute);

	// Healthcheck
	router.get('/ping', (req, res, next) => res.status(200).json({ message: 'pong' }));

	// Error handling
	router.use((req, res, next) => {
		const error = new Error('Sorry, but this rote doesnt exists');

		Logging.error(error);

		res.status(404).json({
			message: error.message,
		});
	});

	http.createServer(app).listen(config.server.port, () =>
		Logging.info(`Server is running on port ${config.server.port}`),
	);
};
