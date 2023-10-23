import mongoose, { Document, Schema } from 'mongoose';

export interface IAdmin {
	email: string;
	password: string;
	role: string;
}

export interface IAdminModel extends IAdmin, Document {}

const AdminSchema: Schema = new Schema(
	{
		email: {
			type: String,
			required: true,
		},
		password: {
			type: String,
			required: true,
		},
		role: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Role',
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model<IAdminModel>('Admin', AdminSchema);
