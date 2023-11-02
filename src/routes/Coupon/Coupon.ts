import express from 'express';
import controller from '../../controllers/Coupon/Coupon';
import { verifyAdminJWT } from '../../middleware/VerifyAdmin';
import { Schemas, ValidateSchema } from '../../middleware/ValidateSchema';
import { CounponsMiddleware } from '../../middleware/Coupon';

const router = express.Router();

// ************************************************************
// * This Users routes is splited in two partes:              *
// * 1. Normal user acess (Users form the mobile application) *
// * 2. Admin from the admin panel                            *
// ************************************************************

// 1. Normal User Acess

router.get('/code/:couponCode', controller.readByCode);

// 2. Admin Access Level

// Get all Coupon
router.get('/', verifyAdminJWT, controller.readAll);

// Create Coupon
router.post(
	'/',
	[
		verifyAdminJWT,
		ValidateSchema(Schemas.coupon.create),
		CounponsMiddleware.checkDuplicateCoupon,
	],
	controller.createCoupon,
);

// Get Coupon ByID
router.get('/:couponId', verifyAdminJWT, controller.readCoupon);

// Update Coupon ByID
router.patch(
	'/:couponId',
	[verifyAdminJWT, ValidateSchema(Schemas.coupon.update)],
	controller.updateCoupon,
);

// Delete Coupon ByID
router.delete('/:couponId', verifyAdminJWT, controller.deleteCoupon);

// Test new query -- FOR TESTING PURPOSES ONLY
router.get('/couponByAccess/:accessType', verifyAdminJWT, controller.couponByAccess);

export = router;
