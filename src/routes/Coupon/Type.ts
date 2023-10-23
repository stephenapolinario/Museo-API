import express from 'express';
import controller from '../../controllers/Coupon/CouponType';
import { verifyAdminJWT } from '../../middleware/VerifyAdmin';
import { Schemas, ValidateSchema } from '../../middleware/ValidateSchema';
import { CounponsMiddleware } from '../../middleware/Coupon';

const router = express.Router();

// Get all CouponsType
router.get('/', verifyAdminJWT, controller.readAll);

// Create CouponType
router.post(
	'/',
	[
		verifyAdminJWT,
		ValidateSchema(Schemas.couponType.create),
		CounponsMiddleware.checkDuplicateCouponType,
	],
	controller.createCouponType,
);

// Get CouponType by ID
router.get('/:couponId', verifyAdminJWT, controller.readCouponType);

// Update CouponType by ID
router.patch(
	'/:couponId',
	[verifyAdminJWT, ValidateSchema(Schemas.couponType.update)],
	controller.updateCouponType,
);

// Delete CouponType by ID
router.delete('/:couponId', verifyAdminJWT, controller.deleteCouponType);

export = router;
