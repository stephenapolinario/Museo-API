import { Request, Response, NextFunction } from 'express';
import CategoryModel from '../models/Product/Category';
import Logging from '../library/Logging';

const checkDuplicateCategoryType = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const category = await CategoryModel.findOne({ name: req.body.type });

		if (category) {
			Logging.warn(`Category type [${category.name}] already exists`);
			return res.status(400).json({ error: 'Failed! Category type already exists!' });
		}
		next();
	} catch (error) {
		Logging.error(`Error in checkDuplicateCategoryType in user middleware: [$error]`);
		return res.status(500).json({ error: 'Internal server error' });
	}
};

export const ProductsMiddleware = {
	checkDuplicateCategoryType,
};
