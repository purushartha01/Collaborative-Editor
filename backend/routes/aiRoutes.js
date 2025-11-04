import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { autoCompleter, grammarChecker, suggestionProvider, summarizer, textEnhancer } from "../controllers/aiController.js";
import { body } from 'express-validator';

const aiRoutes = Router();

aiRoutes.use(authMiddleware);

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


aiRoutes.route("/ai/grammar-check")
    .post(fileContentValidator, grammarChecker);
aiRoutes.route("/ai/summarize").post(fileContentValidator, summarizer);
aiRoutes.route("/ai/enhance").post(fileContentValidator, textEnhancer);
aiRoutes.route("/ai/complete").post(fileContentValidator, autoCompleter);
aiRoutes.route("/ai/suggestions").post(fileContentValidator, suggestionProvider);

export default aiRoutes;