import express from 'express';
import controller from '../../controllers/Product/Category';
import { Schemas, ValidateSchema } from '../../middleware/ValidateSchema';
import { verifyAdminJWT } from '../../middleware/VerifyAdmin';

const router = express.Router();

// Get all Product Category
router.get('/', verifyAdminJWT, controller.readAll);

// Create Product Category
router.post(
	'/',
	[verifyAdminJWT, ValidateSchema(Schemas.productCategory.create)],
	controller.createCategory,
);

// Get Product Category ByID
router.get('/:categoryId', verifyAdminJWT, controller.readCategory);

// Update Product Category ByID
router.patch(
	'/:categoryId',
	[verifyAdminJWT, ValidateSchema(Schemas.productCategory.create)],
	controller.updateCategory,
);

// Delete Product Category ByID
router.delete('/:categoryId', verifyAdminJWT, controller.deleteCategory);

export = router;
