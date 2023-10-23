import { Request, Response, NextFunction } from 'express';
import UserModel from '../models/User';
import AdminModel from '../models/Admin';
import Logging from '../library/Logging';

const checkUserDuplicateEmail = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const user = await UserModel.findOne({ email: req.body.email });

		if (user) {
			Logging.warn(`Email [${user.email}] is already in use!`);
			return res.status(400).json({ error: 'Failed! Email is already in use' });
		}
		next();
	} catch (error) {
		Logging.error(`Error in checkUserDuplicateEmail in user middleware: [$error]`);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

const checkAdminDuplicateEmail = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const admin = await AdminModel.findOne({ email: req.body.email });

		if (admin) {
			Logging.warn(`Email [${admin.email}] is already in use`);
			return res.status(400).json({ error: 'Failed! Email is already in use' });
		}
		next();
	} catch (error) {
		Logging.error(`Error in checkDuplicateEmail in admin middleware: [${error}]`);
		res.status(500).json({ error: 'Internal server error' });
	}
};

// With this mode, its possible to implement more middlewares here. eg: check CPF
export const VerifySignUp = {
	checkUserDuplicateEmail,
	checkAdminDuplicateEmail,
};
