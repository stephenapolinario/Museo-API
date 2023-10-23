import express from 'express';
import controller from '../controllers/Ticket';
import { verifyAdminJWT } from '../middleware/VerifyAdmin';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

// ************************************************************
// * This Users routes is splited in two partes:              *
// * 1. Normal user acess (Users form the mobile application) *
// * 2. Admin from the admin panel                            *
// ************************************************************

// 1. Normal User Acess

// Get all Ticket
router.get('/', controller.readAll);

// Get Ticket ByID
router.get('/:ticketId', controller.readTicket);

// 2. Admin access level

// Create Ticket
router.post('/', [verifyAdminJWT, ValidateSchema(Schemas.ticket.create)], controller.createTicket);

// Update Ticket ByID
router.patch(
	'/:ticketId',
	[verifyAdminJWT, ValidateSchema(Schemas.ticket.update)],
	controller.updateTicket,
);

// Delete Ticket ByID
router.delete('/:ticketId', verifyAdminJWT, controller.deleteTicket);

export = router;
