import mongoose, { Schema, Document } from 'mongoose';

export interface IEmblem {
	title: string;
	image: string;
	minPoints: number;
	maxPoints: number;
	tour: string;
	quiz: string;
}

export interface IEmblemModel extends IEmblem, Document {}

const EmblemSchema: Schema = new Schema({
	title: {
		type: String,
		required: true,
	},
	image: {
		type: String,
		required: true,
	},
	minPoints: {
		type: Number,
		required: true,
	},
	maxPoints: {
		type: Number,
		required: true,
	},
	tour: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Tour',
	},
	quiz: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Quiz',
	},
});

export default mongoose.model<IEmblemModel>('Emblem', EmblemSchema);
