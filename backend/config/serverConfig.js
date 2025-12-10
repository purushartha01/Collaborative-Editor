import { configDotenv } from "dotenv";
configDotenv();


const PORTNO = process.env.PORT || 3000;


const MONGODB_URL = `mongodb+srv://${process.env.MONGODB_UNAME}:${process.env.MONGODB_PWD}@maincluster.wqqw6hg.mongodb.net/collaborative-editor?appName=MainCluster`;

const baseUrl = process.env.FROTEND_BASE_URL;

const jwt_options = {
    expiresIn: '1h',
    algorithm: 'HS256'
};

const jwt_secret_key = process.env.JWT_SECRET_KEY;

const jwt_access_secret = process.env.ACCESS_TOKEN_SECRET;
const jwt_refresh_secret = process.env.REFRESH_TOKEN_SECRET;


const Gemini_API_Key = process.env.GEMINI_API_KEY;

const Google_OAuth_Client_ID = process.env.GOOGLE_CLIENT_ID;
const Google_OAuth_Client_Secret = process.env.GOOGLE_CLIENT_SECRET;
const Google_OAuth_Redirect_URI = process.env.GOOGLE_AUTHORIZED_REDIRECT_URL;
const State_Secret_Key = process.env.STATE_SECRET_KEY;

export { PORTNO, MONGODB_URL, jwt_access_secret, jwt_refresh_secret, jwt_options, Gemini_API_Key, Google_OAuth_Client_ID, Google_OAuth_Client_Secret, Google_OAuth_Redirect_URI, State_Secret_Key, jwt_secret_key, baseUrl };