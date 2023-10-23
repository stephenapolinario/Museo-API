import mongoose, { Document, Schema } from 'mongoose';

export interface ICouponAccess {
	access: string;
}

export interface ICouponAccessModel extends ICouponAccess, Document {}

const CouponAccessSchema: Schema = new Schema(
	{
		access: {
			type: String,
			required: true,
			enum: ['value', 'percentage'],
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model<ICouponAccessModel>('CouponAccess', CouponAccessSchema);
