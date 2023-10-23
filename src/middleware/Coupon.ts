import { Request, Response, NextFunction } from 'express';
import CouponTypeModel from '../models/Coupon/CouponType';
import CouponAccessModel from '../models/Coupon/CouponAccess';
import CouponModel from '../models/Coupon/Coupon';
import Logging from '../library/Logging';

const checkDuplicateCouponType = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const couponType = await CouponTypeModel.findOne({ type: req.body.type });

		if (couponType) {
			Logging.warn(`Coupon type [${couponType.type}] already exists`);
			return res.status(400).json({ error: 'Failed! Coupon type already exists!' });
		}
		next();
	} catch (error) {
		Logging.error(`Error in checkDuplicateCouponType in user middleware: [$error]`);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

const checkDuplicateCouponAccess = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const couponAccess = await CouponAccessModel.findOne({ access: req.body.access });

		if (couponAccess) {
			Logging.warn(`Coupon access [${couponAccess.access}] already exists`);
			return res.status(400).json({ error: 'Failed! Coupon access already exists!' });
		}
		next();
	} catch (error) {
		Logging.error(`Error in checkDuplicateCouponAccess in user middleware: [$error]`);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

const checkDuplicateCoupon = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const coupon = await CouponModel.findOne({ code: req.body.code });

		if (coupon) {
			Logging.warn(`Coupon code [${coupon.code}] already exists`);
			return res.status(400).json({ error: 'Failed! Coupon code already exists!' });
		}
		next();
	} catch (error) {
		Logging.error(`Error in checkDuplicateCoupon in user middleware: [$error]`);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

export const CounponsMiddleware = {
	checkDuplicateCouponType,
	checkDuplicateCouponAccess,
	checkDuplicateCoupon,
};
