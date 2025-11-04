import { validationResult } from 'express-validator';
import { getUserByEmail, hashPassword, matchPassword } from '../services/userService.js';
import { generateTokens } from '../utils/helper.js';


const loginController = async (req, res, next) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.locals.statusCode = 400;
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

        const { accessToken, refreshToken } = generateTokens(userExists);

        res.status(200).json({ message: 'Login successful', user: userExists, accessToken, refreshToken });
    } catch (err) {
        next(err);
    }
}

const registerController = async (req, res, next) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.locals.statusCode = 400;
            throw new Error('Insufficient or invalid registration data');
        }
        const { username, email, password } = req.body;
        const hashedPassword = await hashPassword(password);
        const user = await createUser({ username, email, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        next(err);
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

const refreshController = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            res.locals.statusCode = 400;
            throw new Error('Refresh token is required');
        }

        const user = verifyRefresh(refreshToken);
        if (!user) {
            res.locals.statusCode = 401;
            throw new Error('Invalid refresh token');
        }
        const userExists = await getUserById(user.userId);
        if (!userExists) {
            res.locals.statusCode = 404;
            throw new Error('User not found');
        }

        const newTokens = generateTokens(userExists);

        res.status(200).json({ message: 'Tokens refreshed successfully', ...newTokens });
    } catch (err) {
        next(err);
    }
}


export {
    loginController,
    registerController,
    getCurrentUserController,
    logoutController,
    refreshController
}