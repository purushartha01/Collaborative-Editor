import { Router } from "express";
import authMiddleware from './../middlewares/authMiddleware.js';
import { body } from 'express-validator';
import { getAllDocuments, createDocument, getDocumentById, updateDocument, deleteDocument, shareDocument } from '../controllers/documentController.js';

const documentRoutes = Router();

documentRoutes.use(authMiddleware)

documentRoutes.route("/documents")
    .get(getAllDocuments)
    .post([
        body("title").notEmpty().withMessage("Title is required")
    ], createDocument);

documentRoutes.route("/documents/:id")
    .get(getDocumentById)
    .put(
        [
            body("title").notEmpty().withMessage("Title is required"),
            body("content").isString().withMessage("Content must be a string")

        ], updateDocument)
    .delete(deleteDocument);

documentRoutes.route("/documents/:id/share")
    .post([
        body("shareWith").isMongoId().withMessage("Valid userId is required"),
        body("role").isIn(["owner", "editor", "viewer"]).withMessage("Role must be one of owner, editor, viewer")
    ], shareDocument);

export default documentRoutes;