import express from 'express';
import controller from '../controllers/User';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';
import { verifyAdminJWT } from '../middleware/VerifyAdmin';
import { VerifySignUp } from '../middleware/SignUp';

const router = express.Router();

// ************************************************************
// * This Users routes is splited in two partes:              *
// * 1. Normal user acess (Users form the mobile application) *
// * 2. Admin from the admin panel                            *
// ************************************************************

// 1. Normal User Acess

// Create User
router.post(
	'/',
	[VerifySignUp.checkUserDuplicateEmail, ValidateSchema(Schemas.user.create)],
	controller.createUser,
);

// Update User Information by ID
router.patch('/:userId', ValidateSchema(Schemas.user.update), controller.updateUser);

// Login User
router.post('/login', ValidateSchema(Schemas.user.login), controller.loginUser);

// 2. The routes below this line must have an Admin JWT

// Get All User
router.get('/', verifyAdminJWT, controller.readAll);

// Get User by ID
router.get('/:userId', verifyAdminJWT, controller.readUser);

// Delete User by ID
router.delete('/:userId', verifyAdminJWT, controller.deleteUser);

export = router;
