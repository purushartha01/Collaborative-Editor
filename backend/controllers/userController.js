import { validationResult } from 'express-validator';
import { getUserByEmail, matchPassword } from '../services/userService.js';


const loginController = async (req, res, next) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.locals.statusCode = 404;
            throw new Error('Insufficient or invalid login data');
        }
        const { email, password } = req.body;

        const userExists = await getUserByEmail(email);
        if (!userExists) {
            res.locals.statusCode = 404;
            throw new Error('No user found with provided credentials');
        }

        const doesPasswordsMatch = await matchPassword(password, userExists.password);
        if (!doesPasswordsMatch) {
            res.locals.statusCode = 401;
            throw new Error('Incorrect password');
        }

        const { accessToken, refreshToken } = await generateTokens(userExists);

        res.status(200).json({ message: 'Login successful', user: userExists, accessToken, refreshToken });
    } catch (err) {
        next(err);
    }
}

const registerController = (req, res, next) => {
    try {

    } catch (err) {

    }
}

const getCurrentUserController = (req, res, next) => {
    try {

    }
    catch (err) {

    }
}

const logoutController = (req, res, next) => {
    try {

    } catch (err) {

    }
}

export {
    loginController,
    registerController,
    getCurrentUserController,
    logoutController
}