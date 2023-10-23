import mongoose, { Schema, Document } from 'mongoose';

export interface IProductCategory {
	name: string;
}

export interface IProductCategoryModel extends IProductCategory, Document {}

const ProductCategorySchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model<IProductCategoryModel>('ProductCategory', ProductCategorySchema);
