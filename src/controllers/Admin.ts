import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Admin from '../models/Admin';
import Role from '../models/Role';
import Logging from '../library/Logging';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const createAdmin = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;

	// For implement user, the role should be like: role = 'user'
	const adminRole = 'admin';
	const role = await Role.findOne({ name: adminRole });
	if (!role) {
		const message = `There is no role called [${adminRole}]`;
		Logging.error(message);
		return res.status(500).json({ error: message });
	}

	const admin = new Admin({
		_id: new mongoose.Types.ObjectId(),
		email,
		password: bcrypt.hashSync(password, 8),
		role,
	});

	try {
		await admin.save();
		const { password, role, ...adminWithoutPassword } = admin.toObject(); // Excluding the password field from the response
		return res.status(201).json({ admin: adminWithoutPassword });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readAdmin = async (req: Request, res: Response, next: NextFunction) => {
	const adminId = req.params.adminId;

	try {
		const admin = await Admin.findById(adminId).populate('role').select('-__v');
		return admin
			? res.status(200).json({ admin })
			: res.status(404).json({ message: 'Not found' });
	} catch (error) {
		// If error is from mongoose cast error return invalid format id
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ error: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};
const readAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const admins = await Admin.find().select(['-__v', '-createdAt', '-updatedAt', '-role']);
		return res.status(200).json({ admins });
	} catch (error) {
		return res.status(500).json({ error });
	}
};
const updateAdmin = async (req: Request, res: Response, next: NextFunction) => {
	const adminId = req.params.adminId;

	try {
		const admin = await Admin.findById(adminId);

		if (!admin) {
			return res.status(401).json({ error: 'There is no admin with this ID' });
		}

		// Try update the user, is update, return user updated. If cant, return error.
		if (req.body.password) {
			req.body.password = bcrypt.hashSync(req.body.password, 8);
		}

		admin.set(req.body);
		admin
			.save()
			.then((admin) => {
				const { password, role, ...adminWithoutPassword } = admin.toObject(); // Excluding the password field from the response
				res.status(201).json({ admin: adminWithoutPassword });
			})
			.catch((error) => res.status(500).json({ error }));
	} catch (error) {
		// If error is from mongoose cast error return invalid format id
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ error: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const deleteAdmin = async (req: Request, res: Response, next: NextFunction) => {
	const adminId = req.params.adminId;

	try {
		const admin = await Admin.findByIdAndDelete(adminId);
		return admin
			? res.status(200).json({ message: 'Admin deleted' })
			: res.status(404).json({ error: 'Not found admin with this ID' });
	} catch (error) {
		// If error is from mongoose cast error return invalid format id
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ error: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const loginAdmin = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;

	try {
		const admin = await Admin.findOne({ email: email }).select([
			'-__v',
			'-_id',
			'-role',
			'-createdAt',
			'-updatedAt',
		]);

		if (!admin) {
			return res.status(404).send({ error: 'Admin Not found' });
		}

		const passwordIsValid = bcrypt.compareSync(password, admin.password);

		if (!passwordIsValid) {
			return res.status(401).send({ error: 'Invalid Password!' });
		}

		const acessToken = process.env.ADMIN_TOKEN_SECRET;
		if (!acessToken) {
			Logging.error('There is no acessToken inside .env');
			process.exit(1);
		}

		const token = jwt.sign({ id: admin.id }, acessToken, {
			algorithm: 'HS256',
			expiresIn: '24h',
		});

		const { password: adminPassword, ...adminWithoutPassword } = admin.toObject();

		res.status(200).send({
			token: token,
			admin: adminWithoutPassword,
		});
	} catch (error) {
		Logging.error(`An error occurred when trying to locate the admin with e-mail [${email}]`);
		Logging.error(error);
		return res.status(500).send({
			error: `An error occurred when trying to locate the admin with e-mail [${email}]`,
		});
	}
};

export default {
	createAdmin,
	readAdmin,
	readAll,
	updateAdmin,
	deleteAdmin,
	loginAdmin,
};
