import jwt from 'jsonwebtoken';

const generateTokens = async (user) => {
    const accessToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    );
}