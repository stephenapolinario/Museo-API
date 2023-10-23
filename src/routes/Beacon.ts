import express from 'express';
import controller from '../controllers/Beacon';
import { verifyAdminJWT } from '../middleware/VerifyAdmin';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

// Get all Beacon
router.get('/', verifyAdminJWT, controller.readAll);

// Create Beacon
router.post('/', [verifyAdminJWT, ValidateSchema(Schemas.beacon.create)], controller.createBeacon);

// Get Beacon ByID
router.get('/:beaconId', verifyAdminJWT, controller.readBeacon);

// Update Beacon ByID
router.patch(
	'/:beaconId',
	[verifyAdminJWT, ValidateSchema(Schemas.beacon.update)],
	controller.updateBeacon,
);

// Delete Beacon ByID
router.delete('/:beaconId', verifyAdminJWT, controller.deleteBeacon);

export = router;
