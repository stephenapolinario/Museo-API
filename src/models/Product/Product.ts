import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct {
	name: string;
	description: string;
	image: string;
	price: number;
	size: string;
	color: string;
	category: string;
}

export interface IProductModel extends IProduct, Document {}

const ProductSchema: Schema = new Schema(
	{
		id: {
			type: Number,
			required: true,
		},
		name: {
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
		price: {
			type: Number,
			required: true,
		},
		size: {
			type: String,
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
		category: {
			type: Schema.Types.ObjectId,
			ref: 'ProductCategory',
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model<IProductModel>('Product', ProductSchema);
