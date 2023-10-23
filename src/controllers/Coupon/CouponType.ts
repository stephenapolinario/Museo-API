import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import CouponType from '../../models/Coupon/CouponType';

const createCouponType = async (req: Request, res: Response, next: NextFunction) => {
	const { type } = req.body;

	const coupon = new CouponType({
		_id: new mongoose.Types.ObjectId(),
		type,
	});

	try {
		await coupon.save();
		return res.status(201).json({ coupon });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readCouponType = async (req: Request, res: Response, next: NextFunction) => {
	const couponId = req.params.couponId;

	try {
		const coupon = await CouponType.findById(couponId).select('-__v');
		return coupon
			? res.status(200).json({ coupon })
			: res.status(404).json({ message: 'Not found' });
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ message: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};
const readAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const coupons = await CouponType.find();
		return res.status(200).json({ coupons });
	} catch (error) {
		return res.status(500).json({ error });
	}
};
const updateCouponType = async (req: Request, res: Response, next: NextFunction) => {
	const couponId = req.params.couponId;

	try {
		const coupon = await CouponType.findById(couponId).select('-__v');
		if (!coupon) {
			return res.status(404).json({ message: `Not found coupon with id [${couponId}]` });
		}
		coupon.set(req.body);
		coupon
			.save()
			.then((coupon) => res.status(201).json({ coupon }))
			.catch((error) => res.status(500).json({ error }));
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ message: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};
const deleteCouponType = async (req: Request, res: Response, next: NextFunction) => {
	const couponId = req.params.couponId;

	try {
		const coupon = await CouponType.findByIdAndDelete(couponId);
		return coupon
			? res.status(201).json({ message: 'CouponType deleted' })
			: res.status(404).json({ message: `Not found coupon with id [${couponId}]` });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

export default {
	createCouponType,
	readCouponType,
	readAll,
	updateCouponType,
	deleteCouponType,
};
