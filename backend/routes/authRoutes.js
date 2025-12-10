import express from 'express';


import { googleOAuthHandler, initiateGoogleOAuth } from './../controllers/authController.js';

const authRouter = express.Router();

// Placeholder for OAuth session handling routes
authRouter.get("/google/initiate", initiateGoogleOAuth);

authRouter.get("/google", googleOAuthHandler);

export default authRouter;