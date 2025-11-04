import jwt from 'jsonwebtoken';
import { jwt_options } from '../config/serverConfig.js';


const generateTokens = (user) => {
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

export { generateTokens };