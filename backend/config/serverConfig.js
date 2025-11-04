import { configDotenv } from "dotenv";
configDotenv();


const PORTNO = process.env.PORT || 3000;


const MONGODB_URL = `mongodb+srv://${process.env.MONGODB_UNAME}:${process.env.MONGODB_PWD}@maincluster.wqqw6hg.mongodb.net/collaborative-editor?appName=MainCluster`;

const jwt_options = {
    expiresIn: '1h',
    algorithm: 'HS256'
};

const jwt_access_secret = process.env.ACCESS_TOKEN_SECRET;
const jwt_refresh_secret = process.env.REFRESH_TOKEN_SECRET;


export { PORTNO, MONGODB_URL, jwt_access_secret, jwt_refresh_secret, jwt_options };