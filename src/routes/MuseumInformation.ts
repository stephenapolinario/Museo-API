import express from 'express';
import controller from '../controllers/MuseumInformation';
import { verifyAdminJWT } from '../middleware/VerifyAdmin';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();
// ************************************************************
// * This Users routes is splited in two partes:              *
// * 1. Normal user acess (Users form the mobile application) *
// * 2. Admin from the admin panel                            *
// ************************************************************

// NOTE: Its supose to have JUST ONE Museum Information on the database
// NOTE2: For this porpouse, there is no need to implement Read All and Read by ID. They are commented routes.

// Get all Museum Information
// router.get('/', verifyAdminJWT, controller.readAll);

// Get Museum Information ByID
// router.get('/:museumInformationId', verifyAdminJWT, controller.readMuseumInformation);
// 1. Normal User Acess

// Get the UNIQUE Museum Information
router.get('/', controller.readUnique);

// Create Museum Information
router.post(
	'/',
	[verifyAdminJWT, ValidateSchema(Schemas.MuseumInformation.create)],
	controller.createMuseumInformation,
);

// Update Museum Information ByID
router.patch(
	'/:museumInformationId',
	[verifyAdminJWT, ValidateSchema(Schemas.MuseumInformation.update)],
	controller.updateMuseumInformation,
);

// Delete Museum Information ByID
router.delete('/:museumInformationId', verifyAdminJWT, controller.deleteMuseumInformation);

export = router;
