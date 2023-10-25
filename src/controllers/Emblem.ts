import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Emblem from '../models/Emblem';
import Tour from '../models/Tour';
import Logging from '../library/Logging';
import Quiz from '../models/Quiz';

const createEmblem = async (req: Request, res: Response, next: NextFunction) => {
	const { title, image, minPoints, maxPoints, quiz, tour } = req.body;

	const emblem = new Emblem({
		_id: new mongoose.Types.ObjectId(),
		title,
		image,
		minPoints,
		maxPoints,
		quiz,
	});

	try {
		const providedQuiz = await Quiz.findById(quiz);

		if (!providedQuiz) {
			Logging.warn(`There is no Quiz with ID [${quiz}]`);
			return res.status(400).json({ error: `There is no Quiz with ID [${quiz}]` });
		}

		await emblem.save();
		return res.status(201).json({ emblem });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readEmblem = async (req: Request, res: Response, next: NextFunction) => {
	const emblemId = req.params.emblemId;

	try {
		const emblem = await Emblem.findById(emblemId).populate('quiz').select('-__v');
		return emblem
			? res.status(200).json({ emblem })
			: res.status(404).json({ message: `Not found emblem with id [${emblemId}]` });
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ error: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const emblems = await Emblem.find().populate('quiz').select('-__v');

		return res.status(200).json({ emblems });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const updateEmblem = async (req: Request, res: Response, next: NextFunction) => {
	const emblemId = req.params.emblemId;

	try {
		const emblem = await Emblem.findById(emblemId).select('-__v');

		if (!emblem) {
			return res.status(404).json({ error: `Not found emblem with id [${emblemId}]` });
		}

		if (req.body.quiz) {
			const providedQuiz = await Quiz.findById(req.body.quiz);

			if (!providedQuiz) {
				Logging.warn(`There is no Quiz with ID [${req.body.quiz}]`);
				return res
					.status(400)
					.json({ error: `There is no Quiz with ID [${req.body.quiz}]` });
			}
		}

		emblem.set(req.body);
		emblem
			.save()
			.then((emblem) => res.status(201).json({ emblem }))
			.catch((error) => res.status(500).json({ error }));
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ error: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const deleteEmblem = async (req: Request, res: Response, next: NextFunction) => {
	const emblemId = req.params.emblemId;

	try {
		const emblem = await Emblem.findByIdAndDelete(emblemId);
		return emblem
			? res.status(201).json({ message: 'Emblem deleted' })
			: res.status(404).json({ error: 'Not found' });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

export default {
	createEmblem,
	readEmblem,
	readAll,
	updateEmblem,
	deleteEmblem,
};
