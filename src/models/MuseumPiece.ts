import mongoose, { Schema, Document } from 'mongoose';

export interface IMuseumPiece {
	title: string;
	subtitle: string;
	description: string;
	image: string;
	rssi: number;
	color: string;
	beacon: string;
	tour: string;
}

export interface IMuseumPieceModel extends IMuseumPiece, Document {}

const MuseumSchema: Schema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		subtitle: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		rssi: {
			type: Number,
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
		beacon: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Beacon',
		},
		tour: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Tour',
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model<IMuseumPieceModel>('MuseumPiece', MuseumSchema);
