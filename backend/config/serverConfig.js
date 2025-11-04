import { configDotenv } from "dotenv";
configDotenv();


const PORTNO = process.env.PORT || 3000;


const MONGODB_URL = `mongodb+srv://${process.env.MONGODB_UNAME}:${process.env.MONGODB_PWD}@maincluster.wqqw6hg.mongodb.net/collaborative-editor?appName=MainCluster`;

jwt_options = {
    expiresIn: '1hr',
    algorithm: 'HS256'
};


export { PORTNO, MONGODB_URL };