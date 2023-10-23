import express from 'express';
import controller from '../controllers/MuseumPiece';
import { verifyAdminJWT } from '../middleware/VerifyAdmin';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

// ************************************************************
// * This Users routes is splited in two partes:              *
// * 1. Normal user acess (Users form the mobile application) *
// * 2. Admin from the admin panel                            *
// ************************************************************

// 1. Normal User Acess

// Get Museum Pieces by Tour Mode
router.get('/tour/:tourMode', controller.readByTourMode);

// Get Museum Piece ByID
router.get('/:museumPieceId', controller.readMuseumPiece);

// 2. Admin Access Level

// Get all Museum Piece
router.get('/', verifyAdminJWT, controller.readAll);

// Create Museum Piece
router.post(
	'/',
	[verifyAdminJWT, ValidateSchema(Schemas.museumPiece.create)],
	controller.createMuseumPiece,
);

// Update Museum Piece ByID
router.patch(
	'/:museumPieceId',
	[verifyAdminJWT, ValidateSchema(Schemas.museumPiece.update)],
	controller.updateMuseumPiece,
);

// Delete Museum Piece ByID
router.delete('/:museumPieceId', verifyAdminJWT, controller.deleteMuseumPiece);

export = router;
