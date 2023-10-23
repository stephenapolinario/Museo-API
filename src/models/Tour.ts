import mongoose, { Schema, Document } from 'mongoose';

export interface ITour {
	title: string;
	subtitle: string;
	image: string;
}

export interface ITourModel extends ITour, Document {}

const TourSchema: Schema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		subtitle: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);
export default mongoose.model<ITourModel>('Tour', TourSchema);
