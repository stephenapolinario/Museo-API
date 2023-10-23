import mongoose, { Document, Schema } from 'mongoose';

export interface ICounter {
	type: string;
	seq: number;
}

export interface ICounterModel extends ICounter, Document {}

const CounterSchema: Schema = new Schema(
	{
		type: {
			type: String,
			required: true,
		},
		seq: {
			type: Number,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model<ICounterModel>('Counter', CounterSchema);
