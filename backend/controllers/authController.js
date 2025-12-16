import axios from "axios";
import { getGoogleURL } from "../services/authServices.js";
import { Google_OAuth_Client_ID, Google_OAuth_Client_Secret, Google_OAuth_Redirect_URI } from "../config/serverConfig.js";
import jwt from 'jsonwebtoken';
import { addUser, getUserByEmail } from "../services/userService.js";
import { generateFrontendRedirectURL, generateTokens } from "../utils/helper.js";

const googleOAuthHandler = async (req, res, next) => {
    try {

        // get code from query string
        const { code, state, error } = req.query;

        // if no code received, redirect to client with error
        if (!code || !state || error) {
            res.redirect(`http://localhost:5173/auth/error?error=oauth_failed&details=insufficient_data`);
            return;
        }

        //get google id and access token using the code get user with tokens
        const tokenResponse = await axios.post(`https://oauth2.googleapis.com/token`, new URLSearchParams({
            code: code,
            client_id: Google_OAuth_Client_ID,
            client_secret: Google_OAuth_Client_Secret,
            redirect_uri: Google_OAuth_Redirect_URI,
            grant_type: 'authorization_code'
        }));

        const { id_token } = tokenResponse.data;

        const { sub, email, name, picture } = jwt.decode(id_token);

        console.log({ sub, email, name, picture });

        // check if user exists in DB
        if (!email || !sub || !name) {
            res.redirect(`http://localhost:5173/auth/error?error=oauth_failed&details=incomplete_user_info`);
            return;
        }

        let user = await getUserByEmail(email);
        let doesUserExist = Boolean(user);

        if (!user) {
            const newUser = {
                username: name,
                email: email,
                googleId: sub,
                googleProfilePic: picture
            };
            user = await addUser(newUser);
            doesUserExist = false;
        }
        //upsert the user to the database
        let isModeChangeRequired = false;
        if (!user.googleId) user.googleId = sub, isModeChangeRequired = true;
        if (!user.googleProfilePic) user.googleProfilePic = picture, isModeChangeRequired = true;
        if (isModeChangeRequired) await user.save();

        //create session for the user
        //create access and refresh tokens for user
        const { accessToken, refreshToken } = generateTokens(user);

        let redirectUrl = null;
        if (!doesUserExist) {
            redirectUrl = generateFrontendRedirectURL(JSON.stringify({ accessToken }), '/profile', { username: user?.username, email: user?.email, id: user?._id });
        }
        redirectUrl = generateFrontendRedirectURL(JSON.stringify({ accessToken }), '/', { username: user?.username, email: user?.email, id: user?._id });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'development' ? false : true,
            sameSite: 'None',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });
        res.redirect(redirectUrl);
    } catch (err) {
        next(err);
    }
}

const initiateGoogleOAuth = (req, res, next) => {
    try {
        const { redirectTo } = req.query;
        const googleOAuthURL = getGoogleURL(redirectTo);
        res.redirect(googleOAuthURL);

    } catch (err) {
        next(err);
    }
}


export { googleOAuthHandler, initiateGoogleOAuth };