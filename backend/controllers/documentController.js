import { validationResult } from "express-validator";
import { addCollaborator, getAllDocumentsForUser } from "../services/documentServices.js";
import { grantPermissionBasedOnRole } from "../services/permissionServices.js";

const getAllDocuments = async (req, res, next) => {
    try {
        const documents = await getAllDocumentsForUser(res.locals.user.id);
        res.json({ documents });
    } catch (err) {
        next(err);
    }
}

const createDocument = async (req, res, next) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.locals.statusCode = 400;
            throw new Error(result.array().map(err => err.msg).join(", "));
        }

        const { title } = req.body;

        const { newDocument, updatedUser } = await createDocument({
            title,
            collaborators: [res.locals.user.id],
        });

        if (!newDocument || !updatedUser) {
            res.locals.statusCode = 500;
            throw new Error("Failed to create document or update user");
        }

        res.status(201).json({ document: newDocument.id });
    } catch (err) {
        next(err);
    }
}

const getDocumentById = async (req, res, next) => {
    try {
        const document = await getDocumentById(req.params.id);
        if (!document) {
            res.locals.statusCode = 404;
            throw new Error("Document not found");
        }
        res.json({ document });
    } catch (err) {
        next(err);
    }
}


// TODO: Implement permission check
const updateDocument = async (req, res, next) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.locals.statusCode = 400;
            throw new Error(result.array().map(err => err.msg).join(", "));
        }

        const { title, content } = req.body;

        const updatedDocument = await updateDocument(req.params.id, {
            title,
            content,
        });

        if (!updatedDocument) {
            res.locals.statusCode = 404;
            throw new Error("Document not found");
        }

        res.json({ document: updatedDocument });
    } catch (err) {
        next(err);
    }
}


// TODO: Implement permission check
const deleteDocument = async (req, res, next) => {
    try {
        const deletedDocument = await deleteDocument(req.params.id);
        if (!deletedDocument) {
            res.locals.statusCode = 404;
            throw new Error("Document not found");
        }
        res.status(204).end();
    } catch (err) {
        next(err);
    }
}

const shareDocument = async (req, res, next) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.locals.statusCode = 400;
            throw new Error(result.array().map(err => err.msg).join(", "));
        }

        const { shareWith, role } = req.body;
        const documentId = req.params.id;

        const newPermission = await grantPermissionBasedOnRole(role, shareWith, documentId);
        if (!newPermission) {
            res.locals.statusCode = 500;
            throw new Error("Failed to grant permission");
        }
        const { document } = await addCollaborator(documentId, newPermission._id, res.locals.user.id);
        if (!document) {
            res.locals.statusCode = 500;
            throw new Error("Failed to add collaborator to document");
        }

        // TODO: Notify the user being shared with (e.g., via email or in-app notification)

        res.status(200).json({ message: "Document shared successfully" });

    } catch (err) {
        next(err);
    }
}

export {
    getAllDocuments,
    createDocument,
    getDocumentById,
    updateDocument,
    deleteDocument,
    shareDocument
}