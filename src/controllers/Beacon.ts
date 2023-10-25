import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Beacon from '../models/Beacon';

const createBeacon = async (req: Request, res: Response, next: NextFunction) => {
	const { name, uuid } = req.body;

	const beacon = new Beacon({
		_id: new mongoose.Types.ObjectId(),
		name,
		uuid,
	});

	try {
		await beacon.save();
		return res.status(201).json({ message: `Beacon created` });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readBeacon = async (req: Request, res: Response, next: NextFunction) => {
	const beaconId = req.params.beaconId;

	try {
		const beacon = await Beacon.findById(beaconId).select('-__v');
		return beacon
			? res.status(200).json({ beacon })
			: res.status(404).json({ message: `Not found beacon with id [${beaconId}]` });
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ error: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const beacons = await Beacon.find();
		return res.status(200).json({ beacons });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const updateBeacon = async (req: Request, res: Response, next: NextFunction) => {
	const beaconId = req.params.beaconId;

	try {
		const beacon = await Beacon.findById(beaconId).select('-__v');

		if (!beacon) {
			return res.status(404).json({ error: `Not found beacon with id [${beaconId}]` });
		}

		beacon.set(req.body);
		beacon
			.save()
			.then((beacon) => res.status(201).json({ beacon }))
			.catch((error) => res.status(500).json({ error }));
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ error: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const deleteBeacon = async (req: Request, res: Response, next: NextFunction) => {
	const beaconId = req.params.beaconId;

	try {
		const beacon = await Beacon.findByIdAndDelete(beaconId);
		return beacon
			? res.status(201).json({ message: 'Beacon deleted' })
			: res.status(404).json({ error: 'Not found' });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

export default {
	createBeacon,
	readBeacon,
	readAll,
	updateBeacon,
	deleteBeacon,
};
