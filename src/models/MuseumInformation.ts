import mongoose, { Schema, Document } from 'mongoose';

export interface IMuseumInformation {
	country: string;
	state: string;
	city: string;
	phoneNumberList: IPhoneNumber[];
	emailList: IEmail[];
	operationDay: IOperationDay[];
}

export interface IPhoneNumber {
	phoneNumber: string;
}

export interface IOperationDay {
	day: number;
	open: number;
	close: number;
}

export interface IEmail {
	email: string;
}

export interface IMuseumInformationModel extends IMuseumInformation, Document {}

const PhoneNumberlSchema: Schema = new Schema({
	phoneNumber: {
		type: String,
		required: true,
	},
});

const EmailSchema: Schema = new Schema({
	email: {
		type: String,
		required: true,
	},
});

const OperationDaySchema: Schema = new Schema({
	day: {
		type: Number,
		required: true,
	},
	open: {
		type: Number,
		required: true,
	},
	close: {
		type: Number,
		required: true,
	},
});

const IMuseumInformationSchema: Schema = new Schema(
	{
		country: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
		phoneNumberList: {
			type: [PhoneNumberlSchema],
			required: true,
		},
		emailList: {
			type: [EmailSchema],
			required: true,
		},
		operationDay: {
			type: [OperationDaySchema],
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model<IMuseumInformationModel>(
	'MuseumInformation',
	IMuseumInformationSchema,
);
