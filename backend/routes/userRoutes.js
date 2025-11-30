import { Router } from "express";
import { getCurrentUserController, loginController, logoutController, refreshController, registerController } from "../controllers/userController.js";
import { body } from "express-validator";
import authMiddleware from './../middlewares/authMiddleware.js';

const userRoutes = Router();

userRoutes.route('/register')
    .post(
        [
            body("username").isString().withMessage("Username must be a string"),
            body("email").isEmail().withMessage("Email must be a valid email address"),
            body("password").isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage("Password must be a string and contain at least 8 characters having 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol")
        ],
        registerController
    );

userRoutes.route('/login').post(
    [
        body("email").isEmail().withMessage("Email must be a valid email address"),
        body("password").isString().isStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 }).withMessage("Password must be a string and contain at least 8 characters having 1 lowercase letter, 1 uppercase letter, 1 number, and 1 symbol")
    ], loginController);

userRoutes.route('/me').get(authMiddleware, getCurrentUserController);

userRoutes.route('/logout').post(
    [
        authMiddleware,
        body("_id").isMongoId().withMessage("User ID must be a valid MongoDB ObjectId")
    ],
    logoutController
);

userRoutes.route('/refresh').post(refreshController);

export default userRoutes;