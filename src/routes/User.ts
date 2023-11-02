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

// Update User Information (With JWT)
router.patch('/update', ValidateSchema(Schemas.user.update), controller.updateUser);

// Login User
router.post('/login', ValidateSchema(Schemas.user.login), controller.loginUser);

// Update User Password
router.post(
	'/updatePassword',
	ValidateSchema(Schemas.user.updatePassword),
	controller.updatePassword,
);

// Add to favorites
router.post('/favorite/add', ValidateSchema(Schemas.user.manageFavorite), controller.addFavorite);

// Remove from favorites
router.post(
	'/favorite/remove',
	ValidateSchema(Schemas.user.manageFavorite),
	controller.removeFavorite,
);

// Send reset user password
router.post(
	'/resetPassword/send',
	ValidateSchema(Schemas.user.sendResetPassword),
	controller.sendResetPassword,
);

// Reset password from code
router.post('/resetPassword', ValidateSchema(Schemas.user.resetPassword), controller.resetPassword);

// 2. The routes below this line must have an Admin JWT

// Get All User
router.get('/', verifyAdminJWT, controller.readAll);

// Get User by ID
router.get('/:userId', verifyAdminJWT, controller.readUser);

// Delete User by ID
router.delete('/:userId', verifyAdminJWT, controller.deleteUser);

// Update User Information ByID
router.patch(
	'/:userID',
	[verifyAdminJWT, ValidateSchema(Schemas.user.update)],
	controller.updateUserByID,
);

export = router;
