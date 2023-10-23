import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/User';
import Role from '../models/Role';
import Logging from '../library/Logging';
// const bcrypt = require('bcryptjs');
import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';

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
			: res.status(404).json({ message: 'Not found' });
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ message: 'Invalid ID format' });
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
	const userId = req.params.userId;
	const authHeader = req.headers.authorization;

	// If no token is provided
	if (!authHeader) {
		return res.status(401).json({ auth: false, message: 'No token provided.' });
	}

	// Delete 'bearer' from 'bearer TOKEN'
	const token = authHeader.split(' ')[1];
	const acessToken = process.env.ACCESS_TOKEN_SECRET;
	if (!acessToken) {
		Logging.error('There is no acessToken inside .env');
		process.exit(1);
	}

	try {
		// Check if userID is from an real user
		const user = await User.findById(userId);

		if (!user) {
			return res.status(401).json({ error: 'There is no user with this ID' });
		}

		// First: Check if the token is valid from the acessToken. After, check if the token.id is from the same user that is trying to update.
		jwt.verify(token, acessToken, (err, decoded) => {
			// If token is not valid from acessToken.
			if (err) {
				Logging.warn(`Failed to authenticate with token [${token}]`);
				return res
					.status(403)
					.json({ auth: false, message: 'Failed to authenticate token.' });
			}

			// If is valid, check if the current user from token is the same that want to update
			const decodedPayload = decoded as JwtPayload;
			if (decodedPayload.id !== userId) {
				return res.status(403).json({
					message: 'Your authenticate code is not from this user id',
				});
			}
			// Try update the user, is update, return user updated. If cant, return error.
			if (req.body.password) {
				req.body.password = bcrypt.hashSync(req.body.password, 8);
			}
			user.set(req.body);
			user.save()
				.then((user) => res.status(201).json({ message: 'User updated' }))
				.catch((error) => res.status(500).json({ error }));
		});
	} catch (error) {
		// If error is from mongoose cast error return invalid format id
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ message: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
	const userId = req.params.userId;

	try {
		const user = await User.findByIdAndDelete(userId);
		return user
			? res.status(201).json({ message: 'User deleted' })
			: res.status(404).json({ message: 'Not found' });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const loginUser = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email: email });

		if (!user) {
			return res.status(404).send({ message: 'User Not found.' });
		}

		const passwordIsValid = bcrypt.compareSync(password, user.password);

		if (!passwordIsValid) {
			return res.status(401).send({ message: 'Invalid Password!' });
		}

		const acessToken = process.env.ACCESS_TOKEN_SECRET;
		if (!acessToken) {
			Logging.error('There is no acessToken inside .env');
			process.exit(1);
		}

		const token = jwt.sign({ id: user.id }, acessToken, {
			algorithm: 'HS256',
			expiresIn: '24h',
		});

		res.status(200).send({
			token: token,
		});
	} catch (error) {
		Logging.error(`An error occurred when trying to locate the user with e-mail [${email}]`);
		Logging.error(error);
		return res.status(500).send({
			error: `An error occurred when trying to locate the user with e-mail [${email}]`,
		});
	}
};

export default {
	createUser,
	readUser,
	readAll,
	updateUser,
	deleteUser,
	loginUser,
};
