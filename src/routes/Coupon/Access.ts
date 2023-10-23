import express from 'express';
import controller from '../../controllers/Coupon/CouponAccess';
import { verifyAdminJWT } from '../../middleware/VerifyAdmin';
import { CounponsMiddleware } from '../../middleware/Coupon';
import { Schemas, ValidateSchema } from '../../middleware/ValidateSchema';

const router = express.Router();

// Get all coupon
router.get('/', verifyAdminJWT, controller.readAll);

// Create coupon
router.post(
	'/',
	[
		verifyAdminJWT,
		CounponsMiddleware.checkDuplicateCouponAccess,
		ValidateSchema(Schemas.couponAccess.create),
	],
	controller.createCouponAccess,
);

// Get coupon ByID
router.get('/:couponAccessId', verifyAdminJWT, controller.readCouponAccess);

// Update coupon ByID
router.patch(
	'/:couponAccessId',
	[verifyAdminJWT, ValidateSchema(Schemas.couponAccess.update)],
	controller.updateCouponAccess,
);

// Delete coupon ByID
router.delete('/:couponAccessId', verifyAdminJWT, controller.deleteCouponAccess);

export = router;
