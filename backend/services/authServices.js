import { Google_OAuth_Client_ID, Google_OAuth_Redirect_URI } from "../config/serverConfig.js";
import { createStateJWT } from "../utils/helper.js";

const generateState = () => {
    const randomBytes = new Uint8Array(32);
    crypto.getRandomValues(randomBytes);
    return btoa(String.fromCharCode(...randomBytes))
        .replace(/=/g, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}


const getGoogleURL = () => {
    const baseURL = 'https://accounts.google.com/o/oauth2/v2/auth';

    const state = {
        nonce: generateState(),
        redirectTo: "/",
    }



    const options = {
        redirect_uri: Google_OAuth_Redirect_URI,
        client_id: Google_OAuth_Client_ID,
        access_type: 'offline',
        response_type: 'code',
        prompt: 'consent',
        scope: [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ].join(' '),
        state: createStateJWT(state),
    };


    const queryParams = new URLSearchParams(options).toString();
    console.log(options);

    return `${baseURL}?${queryParams}`;

}

export { getGoogleURL };