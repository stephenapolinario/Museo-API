import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../../models/Product/Product';
import Category from '../../models/Product/Category';
import Counter from '../../models/Counter';
import Logging from '../../library/Logging';

const createProduct = async (req: Request, res: Response, next: NextFunction) => {
	const { name, description, image, price, size, color, category } = req.body;

	const productID = await Counter.findOneAndUpdate(
		{ type: 'productCategory' },
		{ $inc: { seq: 1 } },
		{ new: true },
	);

	let seqID;
	if (productID === null) {
		seqID = 0;
		const newID = new Counter({
			type: 'productCategory',
			seq: seqID,
		});
		newID.save();
	} else {
		seqID = productID.seq;
	}
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		id: seqID,
		name,
		description,
		image,
		price,
		size,
		color,
		category,
	});

	try {
		await product.save();
		return res.status(201).json({ message: product });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readProduct = async (req: Request, res: Response, next: NextFunction) => {
	const productId = req.params.productId;

	try {
		const product = await Product.findById(productId).select('-__v');
		return product
			? res.status(200).json({ product })
			: res.status(404).json({ message: `Not found product with id [${productId}]` });
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ message: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const readAll = async (req: Request, res: Response, next: NextFunction) => {
	try {
		// With this case, you populate the category with only the name and exclude the _id
		// const products = await Product.find().populate('category', 'name -_id').select('-__v');
		const products = await Product.find().populate('category').select('-__v');
		return res.status(200).json({ products });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
	const productId = req.params.productId;

	try {
		const product = await Product.findById(productId).select('-__v');
		if (!product) {
			return res.status(404).json({ message: `Not found product with id [${productId}]` });
		}
		product.set(req.body);
		product
			.save()
			.then((product) => res.status(201).json({ product }))
			.catch((error) => res.status(500).json({ error }));
	} catch (error) {
		if ((error as mongoose.Error).name === 'CastError') {
			return res.status(400).json({ message: 'Invalid ID format' });
		}
		return res.status(500).json({ error });
	}
};

const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
	const productId = req.params.productId;

	try {
		const product = await Product.findByIdAndDelete(productId);
		return product
			? res.status(201).json({ message: 'ProductModel deleted' })
			: res.status(404).json({ message: 'Not found' });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

const readByCategory = async (req: Request, res: Response, next: NextFunction) => {
	const category = req.params.category;

	try {
		const productCategory = await Category.findOne({ name: category });

		if (!productCategory) {
			Logging.info(`There is no category [${category}]`);
			return res.status(400).json({ error: `There is no category [${category}]` });
		}

		const products = await Product.find({ category: productCategory.id });

		return products
			? res.status(201).json({ products })
			: res
					.status(404)
					.json({ message: `Not found product with the category [${category}]` });
	} catch (error) {
		return res.status(500).json({ error });
	}
};

export default {
	createProduct,
	readProduct,
	readAll,
	updateProduct,
	deleteProduct,
	readByCategory,
};
