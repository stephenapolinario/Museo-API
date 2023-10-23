import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import CouponAccess from '../../models/Coupon/CouponAccess';

const createCouponAccess = async (req: Request, res: Response, next: NextFunction) => {
	const { access } = req.body;

	const couponAccess = new CouponAccess({
		_id: new mongoose.Types.ObjectId(),
		access,
	});

	try {
		await couponAccess.save();
		return res.status(201).json({ message: couponAccess });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readCouponAccess = async (req: Request, res: Response, next: NextFunction) => {
	const couponAccessId = req.params.couponAccessId;

	try {
		const couponAccess = await CouponAccess.findById(couponAccessId).select('-__v');
		return couponAccess
			? res.status(200).json({ couponAccess })
			: res
					.status(404)
					.json({ message: `Not found couponAccess with id [${couponAccessId}]` });
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ message: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const couponAccesss = await CouponAccess.find();
		return res.status(200).json({ couponAccesss });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const updateCouponAccess = async (req: Request, res: Response, next: NextFunction) => {
	const couponAccessId = req.params.couponAccessId;

	try {
		const couponAccess = await CouponAccess.findById(couponAccessId).select('-__v');
		if (!couponAccess) {
			return res
				.status(404)
				.json({ message: `Not found couponAccess with id [${couponAccessId}]` });
		}
		couponAccess.set(req.body);
		couponAccess
			.save()
			.then((couponAccess) => res.status(201).json({ couponAccess }))
			.catch((error) => res.status(500).json({ error }));
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ message: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const deleteCouponAccess = async (req: Request, res: Response, next: NextFunction) => {
	const couponAccessId = req.params.couponAccessId;

	try {
		const couponAccess = await CouponAccess.findByIdAndDelete(couponAccessId);
		return couponAccess
			? res.status(201).json({ message: 'Coupon Access deleted' })
			: res.status(404).json({ message: 'Not found' });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

export default {
	createCouponAccess,
	readCouponAccess,
	readAll,
	updateCouponAccess,
	deleteCouponAccess,
};
