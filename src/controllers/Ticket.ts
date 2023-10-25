import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Ticket from '../models/Ticket';

const createTicket = async (req: Request, res: Response, next: NextFunction) => {
	const { name, subname, description, price } = req.body;

	const ticket = new Ticket({
		_id: new mongoose.Types.ObjectId(),
		name,
		subname,
		description,
		price,
	});

	try {
		await ticket.save();
		return res.status(201).json({ message: `Ticket created` });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readTicket = async (req: Request, res: Response, next: NextFunction) => {
	const ticketId = req.params.ticketId;

	try {
		const ticket = await Ticket.findById(ticketId).select('-__v');
		return ticket
			? res.status(200).json({ ticket })
			: res.status(404).json({ error: `Not found ticket with id [${ticketId}]` });
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ error: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const tickets = await Ticket.find();
		return res.status(200).json({ tickets });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const updateTicket = async (req: Request, res: Response, next: NextFunction) => {
	const ticketId = req.params.ticketId;

	try {
		const ticket = await Ticket.findById(ticketId).select('-__v');
		if (!ticket) {
			return res.status(404).json({ error: `Not found ticket with id [${ticketId}]` });
		}
		ticket.set(req.body);
		ticket
			.save()
			.then((ticket) => res.status(201).json({ ticket }))
			.catch((error) => res.status(500).json({ error }));
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ error: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const deleteTicket = async (req: Request, res: Response, next: NextFunction) => {
	const ticketId = req.params.ticketId;

	try {
		const ticket = await Ticket.findByIdAndDelete(ticketId);
		return ticket
			? res.status(201).json({ message: 'Ticket deleted' })
			: res.status(404).json({ error: 'Not found' });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

export default {
	createTicket,
	readTicket,
	readAll,
	updateTicket,
	deleteTicket,
};
