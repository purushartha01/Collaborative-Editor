import { validationResult } from "express-validator";
import { addCollaborator, getAllDocumentsForUser, createDocument, updateDocument, searchDocumentsByTitleForUser, getDocumentById } from "../services/documentServices.js";
import { grantPermissionBasedOnRole } from "../services/permissionServices.js";

const getAllDocumentsController = async (req, res, next) => {
    try {
        const { fileTitle } = req.query;
        if (fileTitle) {
            // Implement search functionality here
            console.log("Searching documents with title:", fileTitle);
            const documents = await searchDocumentsByTitleForUser(fileTitle, res.locals.user.userId);
            console.log("Search results:", documents);
            return res.json({ documents });
        } else {
            const documents = await getAllDocumentsForUser(res.locals.user.userId);
            res.json({ documents });
        }
    } catch (err) {
        next(err);
    }
}

const createDocumentController = async (req, res, next) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.locals.statusCode = 400;
            throw new Error(result.array().map(err => err.msg).join(", "));
        }

        const { title, collaborators } = req.body;

        console.log("Creating document with title:", title);
        console.log("Collaborators:", collaborators);

        // TODO: Remember to add permission entries for collaborators in the permission collection
        const { newDocument, updatedUser } = await createDocument({
            title
        }, res.locals.user.userId);

        console.log("New document created:", newDocument);
        console.log("Updated user:", updatedUser);

        if (!newDocument || !updatedUser) {
            res.locals.statusCode = 500;
            throw new Error("Failed to create document or update user");
        }

        res.status(201).json({ document: newDocument.id });
    } catch (err) {
        next(err);
    }
}

const getDocumentByIdController = async (req, res, next) => {
    try {
        const fileId = req.params.id;
        if (!fileId) {
            res.locals.statusCode = 400;
            throw new Error("Document Id is required");
        }
        const document = await getDocumentById(fileId);
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
const updateDocumentController = async (req, res, next) => {
    try {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            res.locals.statusCode = 400;
            throw new Error(result.array().map(err => err.msg).join(", "));
        }

        const fileId = req.params.id;

        const { title, pages } = req.body;

        console.log("Updating document:", fileId, title, pages);

        const updatedDocument = await updateDocument(fileId, {
            title,
            pages,
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
const deleteDocumentController = async (req, res, next) => {
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

const shareDocumentController = async (req, res, next) => {
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
    getAllDocumentsController,
    createDocumentController,
    getDocumentByIdController,
    updateDocumentController,
    deleteDocumentController,
    shareDocumentController
}