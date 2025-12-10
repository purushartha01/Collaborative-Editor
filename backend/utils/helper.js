import jwt from 'jsonwebtoken';
import { baseUrl, jwt_access_secret, jwt_options, jwt_refresh_secret, State_Secret_Key } from '../config/serverConfig.js';
import mongoose from 'mongoose';


const generateTokens = (user) => {
    try {
        const accessToken = jwt.sign(
            { userId: user._id, email: user.email },
            jwt_access_secret,
            jwt_options
        );

        const refreshToken = jwt.sign(
            { userId: user._id, email: user.email },
            jwt_refresh_secret,
            { ...jwt_options, expiresIn: '7d' }
        );

        return { accessToken, refreshToken };
    }
    catch (err) {
        throw new Error('Error generating tokens');
    }
}

const verifyAccess = (token) => {
    try {
        const decoded = jwt.verify(token, jwt_access_secret, jwt_options);
        return decoded;
    } catch (err) {
        throw new Error('Invalid token');
    }
}

const verifyRefresh = (token) => {
    try {
        const decoded = jwt.verify(token, jwt_refresh_secret, { ...jwt_options, expiresIn: '7d' });
        return decoded;
    } catch (err) {
        throw new Error('Invalid refresh token');
    }
}


// TODO: Implement transaction based operations for cascading DB changes
const useTransaction = async (callback) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const result = await callback(session);
        await session.commitTransaction();
        session.endSession();
        return result;
    }
    catch (err) {
        await session.abortTransaction();
        throw err;
    }
    finally {
        session.endSession();
    }
}


const createStateJWT = (payload) => {
    return jwt.sign(payload, State_Secret_Key, { expiresIn: '10m' });
}

const verifyStateJWT = (token) => {
    return jwt.verify(token, State_Secret_Key);
}

const generateFrontendRedirectURL = (tokens, redirectTo, user) => {
    return new URL(`/auth/callback#token=${encodeURIComponent(tokens)}&redirectTo=${encodeURIComponent(redirectTo)}&user=${encodeURIComponent(JSON.stringify(user))}`, baseUrl);
}

export { generateTokens, verifyAccess, verifyRefresh, useTransaction, createStateJWT, verifyStateJWT, generateFrontendRedirectURL };