import Joi, { ObjectSchema } from 'joi';
import { NextFunction, Response, Request } from 'express';
import Logging from '../library/Logging';
import { IUser } from '../models/User';
import { IAdmin } from '../models/Admin';
import { ICouponType } from '../models/Coupon/CouponType';
import { ICouponAccess as ICouponAccess } from '../models/Coupon/CouponAccess';
import { ICoupon } from '../models/Coupon/Coupon';
import { IProduct } from '../models/Product/Product';
import { IProductCategory } from '../models/Product/Category';
import { ITicket } from '../models/Ticket';
import { ITour } from '../models/Tour';
import { IBeacon } from '../models/Beacon';
import { IMuseumPiece } from '../models/MuseumPiece';
import { IOption, IQuestion, IQuiz } from '../models/Quiz';
import {
	IEmail,
	IMuseumInformation,
	IOperationDay,
	IPhoneNumber,
} from '../models/MuseumInformation';
import { IEmblem } from '../models/Emblem';

export const ValidateSchema = (schema: ObjectSchema) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		try {
			await schema.validateAsync(req.body);

			next();
		} catch (error) {
			Logging.error(error);
			return res.status(422).json({ error });
		}
	};
};

export const Schemas = {
	user: {
		create: Joi.object<IUser>({
			name: Joi.string().required(),
			lastName: Joi.string().required(),
			// email() check if its a valid IANA registry. (https://data.iana.org/TLD/tlds-alpha-by-domain.txt). We disable because like univali.br its not valid.
			email: Joi.string()
				.email({ tlds: { allow: false } })
				.required(),
			// TODO: Create validator for CPF Joi
			cpf: Joi.string().required(),
			birthday: Joi.date().required(),
			phoneNumber: Joi.string().required(),
			cep: Joi.string().required(),
			state: Joi.string().required(),
			city: Joi.string().required(),
			neighborhood: Joi.string().required(),
			address: Joi.string().required(),
			number: Joi.string().required(),
			complement: Joi.string().allow(null, ''),
			password: Joi.string().required(),
			picture: Joi.string().uri().required(),
		}),
		update: Joi.object<IUser>({
			name: Joi.string().allow(null, ''),
			lastName: Joi.string().allow(null, ''),
			// email() check if its a valid IANA registry. (https://data.iana.org/TLD/tlds-alpha-by-domain.txt). We disable because like univali.br its not valid.
			email: Joi.string()
				.email({ tlds: { allow: false } })
				.allow(null, ''),
			// TODO: Create validator for CPF Joi
			cpf: Joi.string().allow(null, ''),
			birthday: Joi.date().allow(null, ''),
			phoneNumber: Joi.string().allow(null, ''),
			cep: Joi.string().allow(null, ''),
			state: Joi.string().allow(null, ''),
			city: Joi.string().allow(null, ''),
			neighborhood: Joi.string().allow(null, ''),
			address: Joi.string().allow(null, ''),
			number: Joi.string().allow(null, ''),
			complement: Joi.string().allow(null, ''),
			picture: Joi.string().uri().allow(null, ''),
			password: Joi.string().allow(null, ''),
		}),
		login: Joi.object<IUser>({
			email: Joi.string().required(),
			password: Joi.string().required(),
		}),
	},
	admin: {
		create: Joi.object<IAdmin>({
			// email() check if its a valid IANA registry. (https://data.iana.org/TLD/tlds-alpha-by-domain.txt). We disable because like univali.br its not valid.
			email: Joi.string()
				.email({ tlds: { allow: false } })
				.required(),
			password: Joi.string().required(),
		}),
		update: Joi.object<IAdmin>({
			// email() check if its a valid IANA registry. (https://data.iana.org/TLD/tlds-alpha-by-domain.txt). We disable because like univali.br its not valid.
			email: Joi.string()
				.email({ tlds: { allow: false } })
				.allow(null, ''),
			password: Joi.string().allow(null, ''),
		}),
		login: Joi.object<IAdmin>({
			// email() check if its a valid IANA registry. (https://data.iana.org/TLD/tlds-alpha-by-domain.txt). We disable because like univali.br its not valid.
			email: Joi.string()
				.email({ tlds: { allow: false } })
				.required(),
			password: Joi.string().required(),
		}),
	},
	couponType: {
		create: Joi.object<ICouponType>({
			type: Joi.string().required(),
		}),
		update: Joi.object<ICouponType>({
			type: Joi.string().required(),
		}),
	},
	couponAccess: {
		create: Joi.object<ICouponAccess>({
			access: Joi.string().required(),
		}),
		update: Joi.object<ICouponAccess>({
			access: Joi.string().required(),
		}),
	},
	coupon: {
		create: Joi.object<ICoupon>({
			code: Joi.string().required(),
			type: Joi.array()
				.items(Joi.string().regex(/^[a-zA-Z0-9]{24}$/))
				.required(),
			access: Joi.array()
				.items(Joi.string().regex(/^[a-zA-Z0-9]{24}$/))
				.required(),
			percentage: Joi.string().required(),
			value: Joi.string().required(),
		}),
		update: Joi.object<ICoupon>({
			code: Joi.string().allow(null, ''),
			type: Joi.array()
				.items(Joi.string().regex(/^[a-zA-Z0-9]{24}$/))
				.allow(null, ''),
			access: Joi.array()
				.items(Joi.string().regex(/^[a-zA-Z0-9]{24}$/))
				.allow(null, ''),
			percentage: Joi.number().allow(null, ''),
			value: Joi.string().allow(null, ''),
		}),
	},
	product: {
		create: Joi.object<IProduct>({
			name: Joi.string().required(),
			description: Joi.string().required(),
			image: Joi.string().uri().required(),
			price: Joi.number().required(),
			size: Joi.string().required(),
			color: Joi.string().required(),
			category: Joi.array()
				.items(Joi.string().regex(/^[a-zA-Z0-9]{24}$/))
				.required(),
		}),
		update: Joi.object<IProduct>({
			name: Joi.string().allow(null, ''),
			description: Joi.string().allow(null, ''),
			image: Joi.string().uri().allow(null, ''),
			price: Joi.number().allow(null, ''),
			size: Joi.string().allow(null, ''),
			color: Joi.string().allow(null, ''),
			category: Joi.array()
				.items(Joi.string().regex(/^[a-zA-Z0-9]{24}$/))
				.allow(null, ''),
		}),
	},
	productCategory: {
		create: Joi.object<IProductCategory>({
			name: Joi.string().required(),
		}),
		update: Joi.object<IProductCategory>({
			name: Joi.string().allow(null, ''),
		}),
	},
	ticket: {
		create: Joi.object<ITicket>({
			name: Joi.string().required(),
			subname: Joi.string().required(),
			description: Joi.string().required(),
			price: Joi.number().required(),
		}),
		update: Joi.object<ITicket>({
			name: Joi.string().allow(null, ''),
			subname: Joi.string().allow(null, ''),
			description: Joi.string().allow(null, ''),
			price: Joi.number().allow(null, ''),
		}),
	},
	tour: {
		create: Joi.object<ITour>({
			title: Joi.string().required(),
			subtitle: Joi.string().required(),
			image: Joi.string().uri().required(),
		}),
		update: Joi.object<ITour>({
			title: Joi.string().allow(null, ''),
			subtitle: Joi.string().allow(null, ''),
			image: Joi.string().uri().allow(null, ''),
		}),
	},
	beacon: {
		create: Joi.object<IBeacon>({
			name: Joi.string().required(),
			uuid: Joi.string().required(),
		}),
		update: Joi.object<IBeacon>({
			name: Joi.string().allow(null, ''),
			uuid: Joi.string().allow(null, ''),
		}),
	},
	museumPiece: {
		create: Joi.object<IMuseumPiece>({
			title: Joi.string().required(),
			subtitle: Joi.string().required(),
			description: Joi.string().required(),
			image: Joi.string().uri().required(),
			rssi: Joi.string().required(),
			color: Joi.string().required(),
			beacon: Joi.string()
				.regex(/^[a-zA-Z0-9]{24}$/)
				.required(),
			tour: Joi.string()
				.regex(/^[a-zA-Z0-9]{24}$/)
				.required(),
		}),
		update: Joi.object<IMuseumPiece>({
			title: Joi.string().allow(null, ''),
			subtitle: Joi.string().allow(null, ''),
			description: Joi.string().allow(null, ''),
			image: Joi.string().uri().allow(null, ''),
			rssi: Joi.string().allow(null, ''),
			color: Joi.string().allow(null, ''),
			beacon: Joi.string()
				.regex(/^[a-zA-Z0-9]{24}$/)
				.allow(null, ''),
			tour: Joi.string()
				.regex(/^[a-zA-Z0-9]{24}$/)
				.allow(null, ''),
		}),
	},
	quiz: {
		create: Joi.object<IQuiz>({
			title: Joi.string().required(),
			beacon: Joi.string()
				.regex(/^[a-zA-Z0-9]{24}$/)
				.required(),
			tour: Joi.string()
				.regex(/^[a-zA-Z0-9]{24}$/)
				.required(),
			rssi: Joi.number().required(),
			color: Joi.string().required(),
			questions: Joi.array()
				.items(
					Joi.object<IQuestion>({
						text: Joi.string().required(),
						color: Joi.string().required(),
						options: Joi.array()
							.items(
								Joi.object<IOption>({
									answer: Joi.string().required(),
									isCorrect: Joi.boolean().required(),
								}).required(),
							)
							.required(),
					}).required(),
				)
				.required(),
		}),
		update: Joi.object<IQuiz>({
			title: Joi.string().allow(null, ''),
			beacon: Joi.string()
				.regex(/^[a-zA-Z0-9]{24}$/)
				.allow(null, ''),
			tour: Joi.string()
				.regex(/^[a-zA-Z0-9]{24}$/)
				.allow(null, ''),
			rssi: Joi.number().allow(null, ''),
			color: Joi.string().allow(null, ''),
			questions: Joi.array()
				.items(
					Joi.object<IQuestion>({
						text: Joi.string().allow(null, ''),
						color: Joi.string().allow(null, ''),
						options: Joi.array()
							.items(
								Joi.object<IOption>({
									answer: Joi.string().allow(null, ''),
									isCorrect: Joi.boolean().allow(null, ''),
								}).allow(null, ''),
							)
							.allow(null, ''),
					}).allow(null, ''),
				)
				.allow(null, ''),
		}),
	},
	MuseumInformation: {
		create: Joi.object<IMuseumInformation>({
			country: Joi.string().required(),
			city: Joi.string().required(),
			state: Joi.string().required(),
			emailList: Joi.array()
				.items(
					Joi.object<IEmail>({
						email: Joi.string().required(),
					}).required(),
				)
				.required(),
			operationDay: Joi.array()
				.items(
					Joi.object<IOperationDay>({
						day: Joi.number().required(),
						open: Joi.number().required(),
						close: Joi.number().required(),
					}).required(),
				)
				.required(),
			phoneNumberList: Joi.array()
				.items(
					Joi.object<IPhoneNumber>({
						phoneNumber: Joi.string().required(),
					}).required(),
				)
				.required(),
		}),
		update: Joi.object<IMuseumInformation>({
			country: Joi.string().allow(null, ''),
			city: Joi.string().allow(null, ''),
			state: Joi.string().allow(null, ''),
			emailList: Joi.array()
				.items(
					Joi.object<IEmail>({
						email: Joi.string().allow(null, ''),
					}).allow(null, ''),
				)
				.allow(null, ''),
			operationDay: Joi.array()
				.items(
					Joi.object<IOperationDay>({
						day: Joi.number().allow(null, ''),
						open: Joi.number().allow(null, ''),
						close: Joi.number().allow(null, ''),
					}).allow(null, ''),
				)
				.allow(null, ''),
			phoneNumberList: Joi.array()
				.items(
					Joi.object<IPhoneNumber>({
						phoneNumber: Joi.string().allow(null, ''),
					}).allow(null, ''),
				)
				.allow(null, ''),
		}),
	},
	emblem: {
		create: Joi.object<IEmblem>({
			title: Joi.string().required(),
			tour: Joi.string()
				.regex(/^[a-zA-Z0-9]{24}$/)
				.required(),
			quiz: Joi.string()
				.regex(/^[a-zA-Z0-9]{24}$/)
				.required(),
			image: Joi.string().uri().required(),
			maxPoints: Joi.number().required(),
			minPoints: Joi.number().required(),
		}),
		update: Joi.object<IEmblem>({
			title: Joi.string().allow(null, ''),
			tour: Joi.string()
				.regex(/^[a-zA-Z0-9]{24}$/)
				.allow(null, ''),
			quiz: Joi.string()
				.regex(/^[a-zA-Z0-9]{24}$/)
				.allow(null, ''),
			image: Joi.string().uri().allow(null, ''),
			maxPoints: Joi.number().allow(null, ''),
			minPoints: Joi.number().allow(null, ''),
		}),
	},
};
