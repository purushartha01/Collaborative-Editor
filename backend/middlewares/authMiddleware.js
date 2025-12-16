import { getUserById } from "../services/userService.js";
import { verifyAccess } from "../utils/helper.js";
import jwt from 'jsonwebtoken';


const authMiddleware = async (req, res, next) => {
    try {
        // TODO: Refresh token flow needs to be tested properly again
        console.log("Auth middleware executed");

        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.locals.statusCode = 400;
            throw new Error('Authorization header missing or malformed');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            res.locals.statusCode = 400;
            throw new Error('Token missing from authorization header');
        }

        const decodedToken = verifyAccess(token);
        console.log("Decoded Token:", decodedToken);

        if (!decodedToken) {
            res.locals.statusCode = 401;
            throw new Error('Invalid token');
        }

        const userExists = await getUserById(decodedToken.userId);
        if (!userExists) {
            res.locals.statusCode = 404;
            throw new Error('User not found');
        }
        res.locals.user = decodedToken;
        next();
    } catch (err) {
        console.error("Auth middleware error:", err);
        if (!res.locals.statusCode && err instanceof jwt.TokenExpiredError) {
            res.locals.statusCode = 401;
            err.message = 'Access token expired';
        }
        next(err);
    }
}

export default authMiddleware;