import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Category from '../../models/Product/Category';

const createCategory = async (req: Request, res: Response, next: NextFunction) => {
	const { name } = req.body;

	const category = new Category({
		_id: new mongoose.Types.ObjectId(),
		name,
	});

	try {
		await category.save();
		return res.status(201).json({ message: category });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readCategory = async (req: Request, res: Response, next: NextFunction) => {
	const categoryId = req.params.categoryId;

	try {
		const category = await Category.findById(categoryId).select('-__v');
		return category
			? res.status(200).json({ category })
			: res.status(404).json({ message: `Not found category with id [${categoryId}]` });
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ message: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const categorys = await Category.find();
		return res.status(200).json({ categorys });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const updateCategory = async (req: Request, res: Response, next: NextFunction) => {
	const categoryId = req.params.categoryId;

	try {
		const category = await Category.findById(categoryId).select('-__v');
		if (!category) {
			return res.status(404).json({ message: `Not found category with id [${categoryId}]` });
		}
		category.set(req.body);
		category
			.save()
			.then((category) => res.status(201).json({ category }))
			.catch((error) => res.status(500).json({ error }));
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ message: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
	const categoryId = req.params.categoryId;

	try {
		const category = await Category.findByIdAndDelete(categoryId);
		return category
			? res.status(201).json({ message: 'Category deleted' })
			: res.status(404).json({ message: 'Not found' });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

export default {
	createCategory,
	readCategory,
	readAll,
	updateCategory,
	deleteCategory,
};
