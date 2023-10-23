import mongoose, { Document, Schema } from 'mongoose';

export interface ICouponType {
	type: string;
}

export interface ICouponTypeModel extends ICouponType, Document {}

const CouponTypeSchema: Schema = new Schema(
	{
		type: {
			type: String,
			required: true,
			enum: ['souvenirs', 'tickets'],
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model<ICouponTypeModel>('CouponType', CouponTypeSchema);
