import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import MuseumPiece from '../models/MuseumPiece';
import Beacon from '../models/Beacon';
import Logging from '../library/Logging';
import Tour from '../models/Tour';

const createMuseumPiece = async (req: Request, res: Response, next: NextFunction) => {
	const { title, subtitle, description, image, rssi, color, beacon, tour } = req.body;

	const museumPiece = new MuseumPiece({
		_id: new mongoose.Types.ObjectId(),
		title,
		subtitle,
		description,
		image,
		rssi,
		color,
		beacon,
		tour,
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

		await museumPiece.save();
		return res.status(201).json({ museumPiece });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readMuseumPiece = async (req: Request, res: Response, next: NextFunction) => {
	const museumPieceId = req.params.museumPieceId;

	try {
		const museumPiece = await MuseumPiece.findById(museumPieceId)
			.populate(['beacon', 'tour'])
			.select('-__v');
		return museumPiece
			? res.status(200).json({ museumPiece })
			: res.status(404).json({ error: `Not found museumPiece with id [${museumPieceId}]` });
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ error: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const museumPieces = await MuseumPiece.find().populate(['beacon', 'tour']).select('-__v');
		return res.status(200).json({ museumPieces });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const updateMuseumPiece = async (req: Request, res: Response, next: NextFunction) => {
	const museumPieceId = req.params.museumPieceId;

	try {
		const museumPiece = await MuseumPiece.findById(museumPieceId).select('-__v');
		if (!museumPiece) {
			return res
				.status(404)
				.json({ error: `Not found museumPiece with id [${museumPieceId}]` });
		}
		museumPiece.set(req.body);
		museumPiece
			.save()
			.then((museumPiece) => res.status(201).json({ museumPiece }))
			.catch((error) => res.status(500).json({ error }));
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ error: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const deleteMuseumPiece = async (req: Request, res: Response, next: NextFunction) => {
	const museumPieceId = req.params.museumPieceId;

	try {
		const museumPiece = await MuseumPiece.findByIdAndDelete(museumPieceId);
		return museumPiece
			? res.status(201).json({ message: 'MuseumPiece deleted' })
			: res.status(404).json({ error: 'Not found' });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readByTourMode = async (req: Request, res: Response, next: NextFunction) => {
	const tourMode = req.params.tourMode;

	try {
		const providedTourMode = await Tour.findOne({ title: tourMode });

		if (!providedTourMode) {
			Logging.warn(`There is no Tour Mode [${tourMode}]`);
			return res.status(400).json({ error: `There is no Tour Mode [${tourMode}]` });
		}

		const museumPiecesFromTourMode = await MuseumPiece.find({ tour: providedTourMode.id })
			.populate(['tour', 'beacon'])
			.select('-__v');

		return res.status(200).json({ museumPiecesFromTourMode });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

export default {
	createMuseumPiece,
	readMuseumPiece,
	readAll,
	updateMuseumPiece,
	deleteMuseumPiece,
	readByTourMode,
};
