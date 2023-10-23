import mongoose, { Document, Schema } from 'mongoose';

export interface ICoupon {
	code: string;
	type: string[];
	access: string[];
	percentage: number;
	value: number;
}

export interface ICouponModel extends ICoupon, Document {}

const CouponSchema: Schema = new Schema(
	{
		code: {
			type: String,
			required: true,
		},
		type: [
			{
				type: Schema.Types.ObjectId,
				ref: 'CouponType',
				required: true,
			},
		],
		access: [
			{
				type: Schema.Types.ObjectId,
				ref: 'CouponAccess',
				required: true,
			},
		],
		percentage: {
			type: Number,
			default: 0,
		},
		value: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model<ICouponModel>('Coupon', CouponSchema);
