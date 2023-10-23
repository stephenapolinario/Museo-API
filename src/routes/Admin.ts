import express from 'express';
import controller from '../controllers/Admin';
import { ValidateSchema, Schemas } from '../middleware/ValidateSchema';
import { verifyAdminJWT } from '../middleware/VerifyAdmin';
import { VerifySignUp } from '../middleware/SignUp';

const router = express.Router();

// Get All Admins
router.get('/', verifyAdminJWT, controller.readAll);

// Create Admin
router.post(
	'/',
	[verifyAdminJWT, ValidateSchema(Schemas.admin.create), VerifySignUp.checkAdminDuplicateEmail],
	controller.createAdmin,
);

// Get Admin ByID
router.get('/:adminId', verifyAdminJWT, controller.readAdmin);

// Update Admin ByID
router.patch(
	'/:adminId',
	[verifyAdminJWT, ValidateSchema(Schemas.admin.update)],
	controller.updateAdmin,
);

// Delete Admin ByID
router.delete('/:adminId', verifyAdminJWT, controller.deleteAdmin);

// Login Admin
router.post('/login', ValidateSchema(Schemas.admin.login), controller.loginAdmin);

export = router;
