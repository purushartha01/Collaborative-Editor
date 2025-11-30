import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { autoCompleter, grammarChecker, suggestionProvider, summarizer, textEnhancer } from "../controllers/aiController.js";
import { body, validationResult } from 'express-validator';

const aiRoutes = Router();


// TODO: Uncomment the below line to enable authentication for AI routes
// aiRoutes.use(authMiddleware);

const fileContentValidator = [
    body('fileContent').isString().withMessage('fileContent must be a string').notEmpty().withMessage('fileContent cannot be empty'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.locals.statusCode = 400;
            throw new Error(errors.array().map(err => err.msg).join(', '));
        }
        next();
    }
]


aiRoutes.route("/grammar-check")
    .post(fileContentValidator, grammarChecker);
aiRoutes.route("/summarize").post(fileContentValidator, summarizer);
aiRoutes.route("/enhance").post(fileContentValidator, textEnhancer);
aiRoutes.route("/complete").post(fileContentValidator, autoCompleter);
aiRoutes.route("/suggestions").post(fileContentValidator, suggestionProvider);

export default aiRoutes;