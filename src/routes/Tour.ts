import express from 'express';
import controller from '../controllers/Tour';
import { verifyAdminJWT } from '../middleware/VerifyAdmin';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

// ************************************************************
// * This Users routes is splited in two partes:              *
// * 1. Normal user acess (Users form the mobile application) *
// * 2. Admin from the admin panel                            *
// ************************************************************

// 1. Normal User Acess

// Get all Tour
router.get('/', controller.readAll);

// Get Tour ByID
router.get('/:tourId', controller.readTour);

// Get all beacons from Tour ID
router.get('/beacons/:tourId', controller.readBeaconsFromTour);

// 2. Admin Access Level

// Create Tour
router.post('/', [verifyAdminJWT, ValidateSchema(Schemas.tour.create)], controller.createTour);

// Update Tour ByID
router.patch(
	'/:tourId',
	[verifyAdminJWT, ValidateSchema(Schemas.tour.update)],
	controller.updateTour,
);

// Delete Tour ByID
router.delete('/:tourId', verifyAdminJWT, controller.deleteTour);

export = router;
