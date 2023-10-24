import mongoose, { Document, Schema } from 'mongoose';
import { IEmblemModel } from './Emblem';

export interface IQuizPeformance {
	quiz: string;
	points: number;
}
export interface IUser {
	name: string;
	lastName: string;
	email: string;
	cpf: string;
	birthday: Date;
	phoneNumber: string;
	cep: string;
	state: string;
	city: string;
	neighborhood: string;
	address: string;
	number: string;
	complement: string;
	password: string;
	picture: string;
	role: string;
	emblems: IEmblemModel[];
	quizPerformances: IQuizPeformance[];
}

export interface IUserModel extends IUser, Document {}

const UserSchema: Schema = new Schema(
	{
		name: {
			type: String,
			required: true,
		},
		lastName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
		},
		cpf: {
			type: String,
			required: true,
		},
		birthday: {
			type: String,
			required: true,
		},
		phoneNumber: {
			type: String,
			required: true,
		},
		cep: {
			type: String,
			required: true,
		},
		state: {
			type: String,
			required: true,
		},
		city: {
			type: String,
			required: true,
		},
		neighborhood: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
		number: {
			type: String,
			required: true,
		},
		complement: {
			type: String,
			required: false,
		},
		password: {
			type: String,
			required: true,
		},
		picture: {
			type: String,
			required: true,
		},
		role: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Role',
		},
		emblems: {
			type: [Object],
			default: [],
		},
		quizPerformances: {
			type: [Object],
			default: [],
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model<IUserModel>('User', UserSchema);
