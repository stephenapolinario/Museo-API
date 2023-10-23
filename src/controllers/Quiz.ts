import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Quiz from '../models/Quiz';
import Beacon from '../models/Beacon';
import Logging from '../library/Logging';
import Tour from '../models/Tour';
import * as crypto from 'crypto';

interface DecryptedData {
	quiz: string;
	points: number;
}

const createQuiz = async (req: Request, res: Response, next: NextFunction) => {
	const { title, beacon, tour, rssi, questions, color } = req.body;

	const quiz = new Quiz({
		_id: new mongoose.Types.ObjectId(),
		title,
		beacon,
		tour,
		rssi,
		questions,
		color,
	});

	try {
		const providedBeacon = await Beacon.findById(beacon);

		if (!providedBeacon) {
			Logging.warn(`There is no beacon with ID [${beacon}]`);
			return res.status(400).json({ error: `There is no beacon with ID [${beacon}]` });
		}

		const providedTour = await Tour.findById(tour);

		if (!providedTour) {
			Logging.warn(`There is no tour with ID [${tour}]`);
			return res.status(400).json({ error: `There is no tour with ID [${tour}]` });
		}

		await quiz.save();
		return res.status(201).json({ quiz });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readQuiz = async (req: Request, res: Response, next: NextFunction) => {
	const quizId = req.params.quizId;

	try {
		const quiz = await Quiz.findById(quizId).select('-__v');
		return quiz
			? res.status(200).json({ quiz })
			: res.status(404).json({ message: `Not found quiz with id [${quizId}]` });
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ message: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const quizs = await Quiz.find();
		return res.status(200).json({ quizs });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const updateQuiz = async (req: Request, res: Response, next: NextFunction) => {
	const quizId = req.params.quizId;

	try {
		const quiz = await Quiz.findById(quizId).select('-__v');
		if (!quiz) {
			return res.status(404).json({ message: `Not found quiz with id [${quizId}]` });
		}
		quiz.set(req.body);
		quiz.save()
			.then((quiz) => res.status(201).json({ quiz }))
			.catch((error) => res.status(500).json({ error }));
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ message: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const deleteQuiz = async (req: Request, res: Response, next: NextFunction) => {
	const quizId = req.params.quizId;

	try {
		const quiz = await Quiz.findByIdAndDelete(quizId);
		return quiz
			? res.status(201).json({ message: 'Quiz deleted' })
			: res.status(404).json({ message: 'Not found' });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

// The comments in this route its for generate an encrypted data.
const generatePerformance = async (req: Request, res: Response, next: NextFunction) => {
	const cryptedPerformance = req.params.performance;
	// const quizzPerfomance = req.body;
	// Logging.info(quizzPerfomance);
	// const quizzPerfomanceString = JSON.stringify(quizzPerfomance);

	if (!cryptedPerformance) {
		Logging.warn('You need to provide a performance to access this endpoint');
		return res
			.status(400)
			.json({ Error: 'You need to provide a performance to access this endpoint' });
	}

	try {
		const AES_KEY = process.env.AES_KEY ?? '';
		const AES_IV = process.env.AES_IV ?? '';
		const AE_METHOD = process.env.AE_METHOD ?? '';

		if (!AES_KEY || !AES_IV || !AE_METHOD) {
			Logging.error('There is no configuration for AES encrypt');
			return res.status(500).json({ error: 'There is some error with AES encrypt' });
		}

		const key = Buffer.from(AES_KEY, 'hex');
		const iv = Buffer.from(AES_IV, 'hex');

		// Encrypt method shoul be like this:
		// const cipher = crypto.createCipheriv(AE_METHOD, key, iv);
		// let encryptedData = cipher.update(quizzPerfomanceString, 'utf8', 'hex');
		// encryptedData += cipher.final('hex');
		// Logging.info(encryptedData);

		// Decrypt
		const decipher = crypto.createDecipheriv(AE_METHOD, key, iv);
		let decryptedData = decipher.update(cryptedPerformance, 'hex', 'utf8');
		decryptedData += decipher.final('utf8');
		const userPerformance: DecryptedData = JSON.parse(decryptedData);

		if (!('quiz' in userPerformance) || !('points' in userPerformance)) {
			Logging.warn('There is no Quiz or Points in the provided performance');
			return res.status(400).json({ Error: 'There is some error in your performance' });
		}
		const objectIdRegex = /^[0-9a-fA-F]{24}$/;

		if (!objectIdRegex.test(userPerformance.quiz)) {
			Logging.warn(`There is no quiz with ID [${userPerformance.quiz}]`);
			return res
				.status(400)
				.json({ Error: `There is no quiz with ID [${userPerformance.quiz}]` });
		}

		const quizFromData = await Quiz.findById(userPerformance.quiz);

		if (!quizFromData) {
			Logging.warn(`There is no quiz with ID [${userPerformance.quiz}]`);
			return res
				.status(400)
				.json({ Error: `There is no quiz with ID [${userPerformance.quiz}]` });
		}

		// If arive here, its all good and you can store the quizz + points + emblem on user.
		// 1. Check the emblem for the user
		// 2. Store the emblem + quizz points to user

		return res.status(200).json({ message: 'Tudo certo meu amigo!' });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

// const generatePerformance = async (req: Request, res: Response, next: NextFunction) => {
// 	// const cryptedPerformance = req.params.performance;
// 	const quizzPerfomance = req.body.result;
// 	const quizzPerfomanceString = JSON.stringify(quizzPerfomance);

// 	// if (!cryptedPerformance) {
// 	// 	Logging.warn('You need to provide a performance to access this endpoint');
// 	// 	return res
// 	// 		.status(400)
// 	// 		.json({ Error: 'You need to provide a performance to access this endpoint' });
// 	// }

// 	try {
// 		const AES_KEY = process.env.AES_KEY ?? '';
// 		const AES_IV = process.env.AES_IV ?? '';
// 		const AE_METHOD = process.env.AE_METHOD ?? '';

// 		if (!AES_KEY || !AES_IV || !AE_METHOD) {
// 			Logging.error('There is no configuration for AES encrypt');
// 			return res.status(500).json({ error: 'There is some error with AES encrypt' });
// 		}

// 		const key = Buffer.from(AES_KEY, 'hex');
// 		const iv = Buffer.from(AES_IV, 'hex');

// 		// Encrypt method shoul be like this:
// 		const cipher = crypto.createCipheriv(AE_METHOD, key, iv);
// 		let encryptedData = cipher.update(quizzPerfomanceString, 'utf8', 'hex');
// 		encryptedData += cipher.final('hex');
// 		Logging.info(encryptedData);

// 		// Decrypt
// 		// const decipher = crypto.createDecipheriv(AE_METHOD, key, iv);
// 		// let decryptedData = decipher.update(cryptedPerformance, 'hex', 'utf8');
// 		// decryptedData += decipher.final('utf8');

// 		return res.status(200).json({ decrypted: encryptedData });
// 	} catch (error) {
// 		return res.status(500).json({ error });
// 	}
// };

export default {
	createQuiz,
	readQuiz,
	readAll,
	updateQuiz,
	deleteQuiz,
	generatePerformance,
};
