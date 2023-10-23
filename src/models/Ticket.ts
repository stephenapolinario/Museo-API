import mongoose, { Schema, Document } from 'mongoose';

export interface ITicket {
	name: string;
	subname: string;
	description: string;
	price: number;
}

export interface ITicektModel extends ITicket, Document {}

const TicketSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		subname: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model<ITicektModel>('Ticket', TicketSchema);
