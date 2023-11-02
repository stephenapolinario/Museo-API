import express from 'express';
import controller from '../../controllers/Product/Category';
import { Schemas, ValidateSchema } from '../../middleware/ValidateSchema';
import { verifyAdminJWT } from '../../middleware/VerifyAdmin';

const router = express.Router();

// ************************************************************
// * This Users routes is splited in two partes:              *
// * 1. Normal user acess (Users form the mobile application) *
// * 2. Admin from the admin panel                            *
// ************************************************************

// 1. Normal User Acess

// Get all Product Category
router.get('/', controller.readAll);

// 2. Adnmin Access Level

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
