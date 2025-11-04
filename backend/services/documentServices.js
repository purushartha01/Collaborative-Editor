import DocumentModel from "../models/documentModel.js"
import userModel from "../models/userModel.js"

const getAllDocumentsForUser = async (userId) => {
    return userModel.findById(userId).populate('collaborations').exec();
}

const createDocument = async (documentData) => {
    const newDocument = await DocumentModel.create(documentData);
    const updatedUser = await userModel.findByIdAndUpdate(documentData.user, { $push: { collaborations: newDocument._id } }, { new: true }).exec();
    return { newDocument: newDocument[0], updatedUser };
}

const getDocumentById = async (documentId) => {
    return DocumentModel.findById(documentId).populate('collaborators').populate('user', "username email").exec();
}

const updateDocument = async (documentId, updatedData) => {
    return DocumentModel.findByIdAndUpdate(documentId, updatedData, { new: true }).populate('collaborators').populate('user', "username email").exec();
}

const deleteDocument = async (documentId) => {
    return DocumentModel.findByIdAndDelete(documentId).exec();
}

const addCollaborator = async (documentId, permissionId, userId) => {
    const document = await DocumentModel.findByIdAndUpdate(documentId, { $push: { collaborators: permissionId } }, { new: true }).exec();
    const updatedUser = await userModel.findByIdAndUpdate(userId, { $push: { collaborations: documentId, collabInvites: permissionId } }, { new: true }).exec();
    return { document, updatedUser };
}

export {
    getAllDocumentsForUser,
    createDocument,
    getDocumentById,
    updateDocument,
    deleteDocument,
    addCollaborator
}