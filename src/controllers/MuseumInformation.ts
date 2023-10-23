import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import MuseumInformation from '../models/MuseumInformation';
import Logging from '../library/Logging';

const createMuseumInformation = async (req: Request, res: Response, next: NextFunction) => {
	const { country, city, state, emailList, operationDay, phoneNumberList } = req.body;

	const museumInformation = new MuseumInformation({
		_id: new mongoose.Types.ObjectId(),
		country,
		city,
		state,
		emailList,
		operationDay,
		phoneNumberList,
	});

	try {
		const alreadyHaveMuseumInformation = await MuseumInformation.countDocuments();

		if (alreadyHaveMuseumInformation) {
			Logging.warn(
				'Already have information about the museum. Please update instead of create a new one.',
			);
			return res.status(400).json({
				error: 'Already have information about the museum. Please update instead of create a new one.',
			});
		}

		await museumInformation.save();
		return res.status(201).json({ museumInformation });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readMuseumInformation = async (req: Request, res: Response, next: NextFunction) => {
	const museumInformationId = req.params.museumInformationId;

	try {
		const museumInformation =
			await MuseumInformation.findById(museumInformationId).select('-__v');
		return museumInformation
			? res.status(200).json({ museumInformation })
			: res.status(404).json({
					message: `Not found museumInformation with id [${museumInformationId}]`,
			  });
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ message: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const museumInformations = await MuseumInformation.find();
		return res.status(200).json({ museumInformations });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readUnique = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const museumInformations = await MuseumInformation.findOne({});

		if (!museumInformations) {
			Logging.warn('There is no museum information right now, you need to create one first!');
			return res.status(400).json({
				error: 'There is no museum information right now, you need to create one first!',
			});
		}

		return res.status(200).json({ museumInformations });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const updateMuseumInformation = async (req: Request, res: Response, next: NextFunction) => {
	const museumInformationId = req.params.museumInformationId;

	try {
		const museumInformation =
			await MuseumInformation.findById(museumInformationId).select('-__v');
		if (!museumInformation) {
			return res
				.status(404)
				.json({ message: `Not found museumInformation with id [${museumInformationId}]` });
		}
		museumInformation.set(req.body);
		museumInformation
			.save()
			.then((museumInformation) => res.status(201).json({ museumInformation }))
			.catch((error) => res.status(500).json({ error }));
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ message: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const deleteMuseumInformation = async (req: Request, res: Response, next: NextFunction) => {
	const museumInformationId = req.params.museumInformationId;

	try {
		const museumInformation = await MuseumInformation.findByIdAndDelete(museumInformationId);
		return museumInformation
			? res.status(201).json({ message: 'MuseumInformation deleted' })
			: res.status(404).json({ message: 'Not found' });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

export default {
	createMuseumInformation,
	readMuseumInformation,
	readAll,
	readUnique,
	updateMuseumInformation,
	deleteMuseumInformation,
};
