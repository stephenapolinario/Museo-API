import express from 'express';
import controller from '../controllers/Quiz';
import { verifyAdminJWT } from '../middleware/VerifyAdmin';
import { Schemas, ValidateSchema } from '../middleware/ValidateSchema';

const router = express.Router();

// WITH THE CURRENT QUIZ TEMPLATE STRUCTURE, YOU CAN UPDATE ANY QUESTION/OPTION LIKE THIS:
// {
//     "quizId": "653593f5339235e79549840b",
//     "questionId": "653593f5339235e79549840d",
//     "options": [
//         {
//             "optionId": "653593f5339235e795498410",
//             "answer": "2", // Updated answer value
//             "isCorrect": true // Updated isCorrect value
//         }
//     ]
// }
// NOTE1: BUT FOR NOW NO ENDPOINT IS IMPLEMENTED TO UPDATE LIKE THIS
// NOTE2: SO IF YOU WANT TO UPDATE LIKE THE QUESTION OR THE AWNSERS OR ANYTHING ELSE YOU MUST PROVIDE THE ENTIRE QUESTION/OPTION STRUCTURE!
// NOTE3: When the user in the application finish a quiz, the application should send an request to the endpoint 'finish'
// ------> This endpoint have encrypted data, to avoid data interception

// ************************************************************
// * This Users routes is splited in two partes:              *
// * 1. Normal user acess (Users form the mobile application) *
// * 2. Admin from the admin panel                            *
// ************************************************************

// 1. Normal User Acess

// Get Quiz ByID
router.get('/:quizId', controller.readQuiz);

// Generate the quiz perfomance to the user and emblem
router.get('/performance/:performance', controller.generatePerformance);

// 2. Admin Access Level

// Get all Quiz
router.get('/', verifyAdminJWT, controller.readAll);

// Create Quiz
router.post('/', [verifyAdminJWT, ValidateSchema(Schemas.quiz.create)], controller.createQuiz);

// Update Quiz ByID
router.patch(
	'/:quizId',
	[verifyAdminJWT, ValidateSchema(Schemas.quiz.update)],
	controller.updateQuiz,
);

// Delete Quiz ByID
router.delete('/:quizId', verifyAdminJWT, controller.deleteQuiz);

export = router;
