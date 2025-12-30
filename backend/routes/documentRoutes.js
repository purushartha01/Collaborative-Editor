import { Router } from "express";
import authMiddleware from './../middlewares/authMiddleware.js';
import { body } from 'express-validator';
import { createDocumentController, getAllDocumentsController, getDocumentByIdController, updateDocumentController, deleteDocumentController, shareDocumentController } from '../controllers/documentController.js';


const documentRoutes = Router();

documentRoutes.use(authMiddleware)

documentRoutes.route("/")
    .get(getAllDocumentsController)
    .post([
        body("title").notEmpty().withMessage("Title is required")
    ], createDocumentController);

documentRoutes.route("/:id")
    .get(getDocumentByIdController)
    .put(
        [
            body("title").notEmpty().withMessage("Title is required"),
            body("pages").isArray().withMessage("Pages must be an array")

        ], updateDocumentController)
    .delete(deleteDocumentController);

documentRoutes.route("/:id/share")
    .post([
        body("shareWith").isMongoId().withMessage("Valid userId is required"),
        body("role").isIn(["owner", "editor", "viewer"]).withMessage("Role must be one of owner, editor, viewer")
    ], shareDocumentController);

export default documentRoutes;