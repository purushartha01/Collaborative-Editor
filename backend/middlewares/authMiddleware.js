import { getUserById } from "../services/userService.js";
import { verifyAccess } from "../utils/helper.js";


const authMiddleware = async (req, res, next) => {
    try {
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

        if (!decodedToken) {
            res.locals.statusCode = 401;
            throw new Error('Invalid token');
        }

        const userExists = await getUserById(decodedToken.id);
        if (!userExists) {
            res.locals.statusCode = 404;
            throw new Error('User not found');
        }
        res.locals.user = decodedToken;
        next();
    } catch (err) {
        next(err);
    }
}

export default authMiddleware;