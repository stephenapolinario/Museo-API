import express from 'express';
import controller from '../controllers/Emblem';
import { verifyAdminJWT } from '../middleware/VerifyAdmin';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

// ************************************************************
// * This Users routes is splited in two partes:              *
// * 1. Normal user acess (Users form the mobile application) *
// * 2. Admin from the admin panel                            *
// ************************************************************

// 1. Normal User Acess

// Get Emblem ByID
router.get('/:emblemId', controller.readEmblem);

// 2. Admin Access Level

// Get all Emblem
router.get('/', verifyAdminJWT, controller.readAll);

// Create Emblem
router.post('/', [verifyAdminJWT, ValidateSchema(Schemas.emblem.create)], controller.createEmblem);

// Update Emblem ByID
router.patch(
	'/:emblemId',
	[verifyAdminJWT, ValidateSchema(Schemas.emblem.update)],
	controller.updateEmblem,
);

// Delete Emblem ByID
router.delete('/:emblemId', verifyAdminJWT, controller.deleteEmblem);

export = router;
