import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Coupon from '../../models/Coupon/Coupon';
import CouponType from '../../models/Coupon/CouponType';
import CouponAccess from '../../models/Coupon/CouponAccess';
import Logging from '../../library/Logging';

const createCoupon = async (req: Request, res: Response, next: NextFunction) => {
	const { code, type, access, percentage, value } = req.body;

	const couponTypePromises = type.map(async (typeId: string) => {
		const couponType = await CouponType.findById(typeId).select('-__v');
		return couponType;
	});

	const couponAccessPromises = access.map(async (accessId: string) => {
		const couponAccess = await CouponAccess.findById(accessId).select('-__v');
		return couponAccess;
	});

	const [couponTypes, couponAccesses] = await Promise.all([
		Promise.all(couponTypePromises),
		Promise.all(couponAccessPromises),
	]);

	const areAllTypesValid = couponTypes.every((type) => type !== null);
	const areAllAccessesValid = couponAccesses.every((access) => access !== null);

	if (!areAllTypesValid) {
		return res.status(400).json({ error: 'One or more Coupon Type IDs are invalid' });
	}

	if (!areAllAccessesValid) {
		return res.status(400).json({ error: 'One or more Coupon Access IDs are invalid' });
	}

	const coupon = new Coupon({
		_id: new mongoose.Types.ObjectId(),
		code,
		type,
		access,
		percentage,
		value,
	});

	try {
		await coupon.save();
		return res.status(201).json({ message: coupon });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readCoupon = async (req: Request, res: Response, next: NextFunction) => {
	const couponId = req.params.couponId;

	try {
		const coupon = await Coupon.findById(couponId).populate(['type', 'access']).select('-__v');
		return coupon
			? res.status(200).json({ coupon })
			: res.status(404).json({ message: `Not found coupon with id [${couponId}]` });
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ message: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const coupons = await Coupon.find().populate(['type', 'access']).select('-__v');
		return res.status(200).json({ coupons });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const updateCoupon = async (req: Request, res: Response, next: NextFunction) => {
	const couponId = req.params.couponId;

	try {
		const coupon = await Coupon.findById(couponId).select('-__v');
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

const deleteCoupon = async (req: Request, res: Response, next: NextFunction) => {
	const couponId = req.params.couponId;

	try {
		const coupon = await Coupon.findByIdAndDelete(couponId);
		return coupon
			? res.status(201).json({ message: 'Coupon deleted' })
			: res.status(404).json({ message: 'Not found' });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const couponByAccess = async (req: Request, res: Response, next: NextFunction) => {
	const accessType = req.params.accessType;

	try {
		const accessTypeQuery = await CouponAccess.findOne({ access: accessType });

		if (!accessTypeQuery) {
			return res.status(400).json({ error: `There is no coupon access [${accessType}]` });
		}

		const coupons = await Coupon.find({ access: { $in: accessTypeQuery.id } })
			.populate(['access', 'type'])
			.select('-__v');
		return coupons
			? res.status(201).json({ access: coupons })
			: res.status(404).json({ message: 'Not found' });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readByCode = async (req: Request, res: Response, next: NextFunction) => {
	const couponCode = req.params.couponCode;

	try {
		const coupon = await Coupon.findOne({ code: couponCode }).populate(['access', 'type']);

		if (!coupon) {
			Logging.warn(`There is no coupon  ${couponCode}`);
			return res.status(400).json({ error: `There is no coupon ${couponCode}` });
		}

		return res.status(200).json({ coupon });
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ error: 'Invalid ID format' });
		}
	}
};

export default {
	createCoupon,
	readCoupon,
	readAll,
	updateCoupon,
	deleteCoupon,
	couponByAccess,
	readByCode,
};
