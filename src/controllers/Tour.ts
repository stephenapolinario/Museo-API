import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Tour from '../models/Tour';
import Logging from '../library/Logging';
import MuseumPiece from '../models/MuseumPiece';
import Quiz from '../models/Quiz';

const createTour = async (req: Request, res: Response, next: NextFunction) => {
	const { title, subtitle, image } = req.body;

	const tour = new Tour({
		_id: new mongoose.Types.ObjectId(),
		title: title.toLowerCase(),
		subtitle,
		image,
	});

	try {
		await tour.save();
		return res.status(201).json({ message: `Tour created` });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readTour = async (req: Request, res: Response, next: NextFunction) => {
	const tourId = req.params.tourId;

	try {
		const tour = await Tour.findById(tourId).select('-__v');
		return tour
			? res.status(200).json({ tour })
			: res.status(404).json({ error: `Not found tour with id [${tourId}]` });
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ error: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const tours = await Tour.find();
		return res.status(200).json({ tours });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const updateTour = async (req: Request, res: Response, next: NextFunction) => {
	const tourId = req.params.tourId;

	try {
		const tour = await Tour.findById(tourId).select('-__v');
		if (!tour) {
			return res.status(404).json({ error: `Not found tour with id [${tourId}]` });
		}

		if (req.body.title) {
			req.body.title = req.body.title.toLowerCase();
		}

		tour.set(req.body);
		tour.save()
			.then((tour) => res.status(201).json({ tour }))
			.catch((error) => res.status(500).json({ error }));
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ error: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const deleteTour = async (req: Request, res: Response, next: NextFunction) => {
	const tourId = req.params.tourId;

	try {
		const tour = await Tour.findByIdAndDelete(tourId);
		return tour
			? res.status(201).json({ message: 'Tour deleted' })
			: res.status(404).json({ error: 'Not found' });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readBeaconsFromTour = async (req: Request, res: Response, next: NextFunction) => {
	const tourId = req.params.tourId;

	try {
		// 1. Ensure that the id exists
		const tour = await Tour.findById(tourId);

		if (!tour) {
			Logging.info(`There is no Tour with ID [${tourId}]`);
			return res.status(400).json({ error: `There is no Tour with ID [${tourId}]` });
		}

		// 2. Check all museums pieces from this Tour
		const museumPieces = await MuseumPiece.find({ tour: tourId }).populate(['beacon']);

		// 3. Check all quizzes from this tour
		const quizzes = await Quiz.find({ tour: tourId }).populate(['beacon']);

		return res.status(200).json({ museumPieces, quizzes });
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ error: 'Invalid ID format' });
		}
		return res.status(400).json({ error });
	}
};

export default {
	createTour,
	readTour,
	readAll,
	updateTour,
	deleteTour,
	readBeaconsFromTour,
};
