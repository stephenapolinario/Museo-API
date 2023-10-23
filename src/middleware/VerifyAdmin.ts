import { Request, Response, NextFunction } from 'express';
import AdminModel from '../models/Admin';
import Logging from '../library/Logging';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const verifyAdminJWT = async (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	// If no token is provided
	if (!authHeader) {
		return res.status(401).json({ auth: false, error: 'No token provided.' });
	}

	// Delete 'bearer' from 'bearer TOKEN'
	const token = authHeader.split(' ')[1];
	const acessToken = process.env.ADMIN_TOKEN_SECRET;
	if (!acessToken) {
		Logging.error('There is no acessToken inside .env');
		process.exit(1);
	}

	try {
		jwt.verify(token, acessToken, (err, decoded) => {
			// If token is not valid from acessToken.
			if (err) {
				Logging.warn(`Failed to authenticate with token [${token}]`);
				return res
					.status(403)
					.json({ auth: false, error: 'Failed to authenticate token.' });
			}
			next();
		});
	} catch (error) {
		Logging.error(`Error in VerifyAdminJWT: [$error]`);
		return res.status(500).json({ error: 'Internal server error' });
	}
};
