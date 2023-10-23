import express from 'express';
import controller from '../../controllers/Product/Product';
import { Schemas, ValidateSchema } from '../../middleware/ValidateSchema';
import { verifyAdminJWT } from '../../middleware/VerifyAdmin';

const router = express.Router();

// ************************************************************
// * This Users routes is splited in two partes:              *
// * 1. Normal user acess (Users form the mobile application) *
// * 2. Admin from the admin panel                            *
// ************************************************************

// 1. Normal User Acess

// Get all Product
router.get('/', controller.readAll);

// Get Product ByID
router.get('/:productId', controller.readProduct);

// Product by Category
router.get('/category/name/:category', controller.readByCategory);

// 2. Admin Access

// Create Product
router.post(
	'/',
	[verifyAdminJWT, ValidateSchema(Schemas.product.create)],
	controller.createProduct,
);

// Update Product ByID
router.patch(
	'/:productId',
	verifyAdminJWT,
	ValidateSchema(Schemas.product.update),
	controller.updateProduct,
);

// Delete Product ByID
router.delete('/:productId', verifyAdminJWT, controller.deleteProduct);

export = router;
