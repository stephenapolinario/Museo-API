import mongoose, { Schema, Document } from 'mongoose';

export interface IBeacon {
	name: string;
	uuid: string;
}

export interface IBeaconModel extends IBeacon, Document {}

const BeaconSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		uuid: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model<IBeaconModel>('Beacon', BeaconSchema);
