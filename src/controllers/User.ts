import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import Role from '../models/Role';
import Logging from '../library/Logging';
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import MuseumPiece from '../models/MuseumPiece';
import * as crypto from 'crypto';
import SendEmail from './SendEmail';

const createUser = async (req: Request, res: Response, next: NextFunction) => {
	const {
		name,
		lastName,
		email,
		cpf,
		birthday,
		phoneNumber,
		cep,
		state,
		city,
		neighborhood,
		address,
		number,
		complement,
		password,
		picture,
	} = req.body;

	// For implement admin, the role should be like: role = 'admin'
	const userRole = 'user';
	// const role = await Role.findOne({ name: { $in: userRole } });
	const role = await Role.findOne({ name: userRole });
	if (!role) {
		const message = `There is no role called [${userRole}]`;
		Logging.error(message);
		return res.status(500).json({ error: message });
	}

	const roleId = role._id;

	const user = new User({
		_id: new mongoose.Types.ObjectId(),
		name,
		lastName,
		email,
		cpf,
		birthday,
		phoneNumber,
		cep,
		state,
		city,
		neighborhood,
		address,
		number,
		complement,
		password: bcrypt.hashSync(password, 8),
		picture,
		role: roleId,
	});

	try {
		await user.save();
		const { password, ...userWithoutPassword } = user.toObject();
		return res.status(201).json({ user: userWithoutPassword });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readUser = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.params.userId;

	try {
		const user = await User.findById(userId).populate('role').select('-__v');
		return user
			? res.status(200).json({ user })
			: res.status(404).json({ error: 'Not found user with this id' });
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ error: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const users = await User.find().populate('role').select('-__v');
		return res.status(200).json({ users });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const updateUser = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	// If no token is provided
	if (!authHeader) {
		return res.status(401).json({ auth: false, error: 'No token provided.' });
	}

	// Delete 'bearer' from 'bearer TOKEN'
	const token = authHeader.split(' ')[1];
	const acessToken = process.env.ACCESS_TOKEN_SECRET;
	if (!acessToken) {
		Logging.error('There is no acessToken inside .env');
		process.exit(1);
	}

	try {
		// First: Check if the token is valid from the acessToken. After, check if the token.id is from the same user that is trying to update.
		var decodedPayload = jwt.verify(token, acessToken) as JwtPayload;
		const userID = decodedPayload.id;

		const user = await User.findById(userID);

		if (!user) {
			Logging.warn(
				`Error while try to update information about user with ID [${userID}] from auth [${token}]`,
			);
			return res.status(400).json({ error: 'There is no user with youd authID' });
		}

		// Check if the new email is avaliable
		const userOldEmail = user.email;
		const newEmail = req.body['email'];

		if (newEmail && newEmail != userOldEmail) {
			const emailIsUsed = await User.findOne({ email: newEmail });

			if (emailIsUsed) {
				Logging.warn(`Oh no, the new email [${newEmail}] is already in use!`);
				return res
					.status(400)
					.json({ error: `Oh no, the new email [${newEmail}] is already in use!` });
			}
		}

		user.set(req.body);
		user.save()
			.then((user) => res.status(200).json({ message: 'User updated' }))
			.catch((error) => res.status(500).json({ error }));
	} catch (error) {
		// If error is from mongoose cast error return invalid format id
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ error: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const updateUserByID = async (req: Request, res: Response, next: NextFunction) => {
	const { userID } = req.params;

	try {
		const user = await User.findById(userID);

		if (!user) {
			Logging.warn(`There is no user with ID [${userID}]`);
			return res.status(400).json({ error: `There is no user with ID [${userID}]` });
		}

		// Check if the new email is avaliable
		const userOldEmail = user.email;
		const newEmail = req.body['email'];

		if (newEmail && newEmail != userOldEmail) {
			const emailIsUsed = await User.findOne({ email: newEmail });

			if (emailIsUsed) {
				Logging.warn(`Oh no, the new email [${newEmail}] is already in use!`);
				return res
					.status(400)
					.json({ error: `Oh no, the new email [${newEmail}] is already in use!` });
			}
		}

		user.set(req.body);
		user.save()
			.then((user) => res.status(200).json({ message: 'User updated' }))
			.catch((error) => res.status(500).json({ error }));
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ error: 'Invalid ID format' });
		}
		Logging.error(error);
		return res.status(400).json({ error });
	}
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.params.userId;

	try {
		const user = await User.findByIdAndDelete(userId);
		return user
			? res.status(201).json({ message: 'User deleted' })
			: res.status(404).json({ error: 'Not found' });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;

	try {
		const acessToken = process.env.ACCESS_TOKEN_SECRET;
		var user;

		if (!acessToken) {
			Logging.error('There is no acessToken inside .env');
			process.exit(1);
		}

		// Method 1: Login with Email & Password
		if (email && password) {
			user = await User.findOne({ email: email }).select([
				'-__v',
				'-createdAt',
				'-updatedAt',
				'-role',
			]);

			if (!user) {
				return res.status(404).send({ error: 'Email Not found' });
			}

			const passwordIsValid = bcrypt.compareSync(password, user.password);

			if (!passwordIsValid) {
				return res.status(401).send({ error: 'Invalid Password!' });
			}
		} else if (req.headers.authorization) {
			// Method 2: Login with user JWT
			const authHeader = req.headers.authorization;

			// Delete 'bearer' from 'bearer TOKEN'
			const token = authHeader.split(' ')[1];
			const acessToken = process.env.ACCESS_TOKEN_SECRET;
			if (!acessToken) {
				Logging.error('There is no acessToken inside .env');
				process.exit(1);
			}

			var decodedPayload = jwt.verify(token, acessToken) as JwtPayload;
			const userID = decodedPayload.id;

			user = await User.findById(userID).select([
				'-__v',
				'-createdAt',
				'-updatedAt',
				'-role',
			]);

			if (!user) {
				return res.status(400).json({ error: 'There is no user with your JWT' });
			}
		} else {
			return res.status(400).json({ error: 'You need provide email & password or user JWT' });
		}

		const { password: userPassword, id, ...userWithoutPassword } = user.toObject();

		const token = jwt.sign({ id: user.id }, acessToken, {
			algorithm: 'HS256',
			expiresIn: '24h',
		});

		res.status(200).send({
			token: token,
			user: userWithoutPassword,
		});
	} catch (error) {
		Logging.error(`An error occurred when trying to locate the user with e-mail [${email}]`);
		Logging.error(error);
		return res.status(500).send({
			error: `An error occurred when trying to locate the user with e-mail [${email}]`,
		});
	}
};

const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
	const { actualPassword, newPassword } = req.body;

	const authHeader = req.headers.authorization;

	// If no token is provided
	if (!authHeader) {
		return res.status(401).json({ auth: false, error: 'No token provided.' });
	}

	// Delete 'bearer' from 'bearer TOKEN'
	const token = authHeader.split(' ')[1];
	const acessToken = process.env.ACCESS_TOKEN_SECRET;
	if (!acessToken) {
		Logging.error('There is no acessToken inside .env');
		process.exit(1);
	}

	var decodedPayload = jwt.verify(token, acessToken) as JwtPayload;
	const userID = decodedPayload.id;

	// 1. Check if the actual password ir right

	const user = await User.findById(userID);

	if (!user) {
		return res.status(400).json({ error: 'There is no user with your auth ID' });
	}

	const passwordIsValid = bcrypt.compareSync(actualPassword, user.password);

	if (!passwordIsValid) {
		return res.status(401).send({ error: 'You entered a wrong actual password' });
	}

	// 2. Update the password
	try {
		await User.findByIdAndUpdate(userID, {
			password: bcrypt.hashSync(newPassword, 8),
		});

		return res.status(200).json({ message: 'User password update suceffuly' });
	} catch (error) {
		return res.status(400).json({ error });
	}
};

const addFavorite = async (req: Request, res: Response, next: NextFunction) => {
	const { favoriteID } = req.body;

	if (!favoriteID) {
		return res.status(400).json({ error: 'You must provide an favorite to add' });
	}

	const authHeader = req.headers.authorization;

	// If no token is provided
	if (!authHeader) {
		return res.status(401).json({ auth: false, error: 'No token provided.' });
	}

	// Delete 'bearer' from 'bearer TOKEN'
	const token = authHeader.split(' ')[1];
	const acessToken = process.env.ACCESS_TOKEN_SECRET;
	if (!acessToken) {
		Logging.error('There is no acessToken inside .env');
		process.exit(1);
	}

	try {
		var decodedPayload = jwt.verify(token, acessToken) as JwtPayload;
		const userID = decodedPayload.id;

		try {
			const museumPiece = await MuseumPiece.findById(favoriteID);

			if (!museumPiece) {
				return res
					.status(400)
					.json({ error: `There is no museum piece with id [${favoriteID}]` });
			}

			const user = await User.findById(userID);

			if (!user) {
				return res.status(400).json({ error: `There is no user with ID [${userID}]` });
			}

			// Check if user already have the favorite
			const alreadyFavorited = user.favorites.some((favorite) => favorite._id == favoriteID);

			if (alreadyFavorited) {
				return res
					.status(400)
					.json({ error: 'User already have favorited this museum piece!' });
			}

			// // If reach here, its all good. Have the museum piece and user. Just add to the favorite user.

			await User.findOneAndUpdate(
				{ _id: user.id },
				{
					$push: {
						favorites: museumPiece,
					},
				},
				{ new: true },
			);

			return res.status(200).json({ message: 'Favorite added' });
		} catch (error) {
			if ((error as mongoose.Error).name === 'CastError') {
				return res.status(400).json({ error: 'Invalid ID format' });
			}
			return res.status(400).json({ error });
		}
	} catch (error) {
		return res.status(400).json({ error });
	}
};

const removeFavorite = async (req: Request, res: Response, next: NextFunction) => {
	const { favoriteID } = req.body;

	if (!favoriteID) {
		return res.status(400).json({ error: 'You must provide an favorite to add' });
	}

	const authHeader = req.headers.authorization;

	// If no token is provided
	if (!authHeader) {
		return res.status(401).json({ auth: false, error: 'No token provided.' });
	}

	// Delete 'bearer' from 'bearer TOKEN'
	const token = authHeader.split(' ')[1];
	const acessToken = process.env.ACCESS_TOKEN_SECRET;
	if (!acessToken) {
		Logging.error('There is no acessToken inside .env');
		process.exit(1);
	}

	try {
		var decodedPayload = jwt.verify(token, acessToken) as JwtPayload;
		const userID = decodedPayload.id;
		const user = await User.findById(userID);

		try {
			if (!user) {
				return res.status(400).json({ error: `There is no user with ID [${userID}]` });
			}

			// Check if user already have the favorite
			const alreadyFavorited = user.favorites.some((favorite) => favorite._id == favoriteID);

			if (!alreadyFavorited) {
				return res
					.status(400)
					.json({ error: 'User already doenst have favorited this museum piece!' });
			}

			// If reach here, its all good. Have the museum piece and user. Just add to the favorite user.
			const updatedFavorites = user.favorites.filter(
				(favorite) => favorite._id != favoriteID,
			);

			await User.findOneAndUpdate(
				{ _id: user._id },
				{ $pull: { favorites: { _id: favoriteID } } },
				{ new: true },
			);

			user.favorites = updatedFavorites;
			await user.save();

			return res.status(200).json({ message: 'Favorite removed!' });
		} catch (error) {
			return res.status(400).json({ error });
		}
	} catch (error) {
		return res.status(400).json({ error });
	}
};

const sendResetPassword = async (req: Request, res: Response, next: NextFunction) => {
	const { email } = req.body;

	try {
		const user = await User.findOne({ email: email });

		if (!user) {
			Logging.info(`There is no user with Email: [${email}]`);
			return res.status(400).json({ error: `There is no user with Email: [${email}]` });
		}

		const emailRecoveryCode = crypto.randomBytes(64).toString('hex');
		const today = new Date();
		const oneDay = today.setDate(today.getDate() + 1);

		await User.findOneAndUpdate(
			{ _id: user._id },
			{
				$set: {
					recoveryPassword: {
						code: emailRecoveryCode,
						expirationDate: oneDay,
					},
				},
			},
			{ new: true },
		);

		await SendEmail(user.email, emailRecoveryCode, res);

		return res.status(200).json({ message: 'Please, check your e-mail inbox.' });
	} catch (error) {
		return res.status(500).json({ error: error });
	}
};

const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
	const { code, password } = req.body;

	try {
		const user = await User.findOne({ 'recoveryPassword.code': code });

		if (!user) {
			return res
				.status(400)
				.json({ error: 'Your code is not valid. Please, get a new one.' });
		}

		if (user.recoveryPassword.expirationDate <= new Date()) {
			return res
				.status(400)
				.json({ error: 'The provided code is experided. Please, get a new one.' });
		}

		await User.findByIdAndUpdate(
			{ _id: user._id },
			{
				$set: {
					password: bcrypt.hashSync(password, 8),
					recoveryPassword: {
						code: '',
						expirationDate: '',
					},
				},
			},
			{
				new: true,
			},
		);

		return res.status(200).json({ message: 'Password updated' });
	} catch (error) {
		return res.status(400).json({ error });
	}
};

export default {
	createUser,
	readUser,
	readAll,
	updateUser,
	updateUserByID,
	deleteUser,
	sendResetPassword,
	resetPassword,
	loginUser,
	updatePassword,
	addFavorite,
	removeFavorite,
};
