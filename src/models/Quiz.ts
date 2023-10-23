import mongoose, { Schema, Document } from 'mongoose';

export interface IQuiz {
	title: string;
	beacon: string;
	tour: string;
	rssi: number;
	questions: IQuestion[];
	color: string;
}

export interface IQuestion {
	text: string;
	color: string;
	options: IOption[];
}

export interface IOption {
	answer: string;
	isCorrect: boolean;
}

export interface IQuizModel extends IQuiz, Document {}

const OptionSchema: Schema = new Schema({
	answer: {
		type: String,
		required: true,
	},
	isCorrect: {
		type: Boolean,
		required: true,
	},
});

const QuestionSchema: Schema = new Schema({
	text: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		required: true,
	},
	options: {
		type: [OptionSchema],
		required: true,
	},
});

const QuizSchema: Schema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		beacon: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Beacon',
		},
		tour: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Tour',
		},
		rssi: {
			type: Number,
			required: true,
		},
		questions: {
			type: [QuestionSchema],
			required: true,
		},
		color: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model<IQuizModel>('Quiz', QuizSchema);
