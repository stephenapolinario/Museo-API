import express from 'express';
import controller from '../../controllers/Coupon/Coupon';
import { verifyAdminJWT } from '../../middleware/VerifyAdmin';
import { Schemas, ValidateSchema } from '../../middleware/ValidateSchema';
import { CounponsMiddleware } from '../../middleware/Coupon';

const router = express.Router();

// Get all routeObject
router.get('/', verifyAdminJWT, controller.readAll);

// Create routeObject
router.post(
	'/',
	[
		verifyAdminJWT,
		ValidateSchema(Schemas.coupon.create),
		CounponsMiddleware.checkDuplicateCoupon,
	],
	controller.createCoupon,
);

// Get routeObject ByID
router.get('/:couponId', verifyAdminJWT, controller.readCoupon);

// Update routeObject ByID
router.patch(
	'/:couponId',
	[verifyAdminJWT, ValidateSchema(Schemas.coupon.update)],
	controller.updateCoupon,
);

// Delete routeObject ByID
router.delete('/:couponId', verifyAdminJWT, controller.deleteCoupon);

// Test new query -- FOR TESTING PURPOSES ONLY
router.get('/couponByAccess/:accessType', verifyAdminJWT, controller.couponByAccess);

export = router;
