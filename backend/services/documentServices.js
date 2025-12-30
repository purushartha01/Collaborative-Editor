import mongoose from "mongoose";
import DocumentModel from "../models/documentModel.js"
import PermissionModel from "../models/permissionModel.js";
import userModel from "../models/userModel.js"

const escapeRegex = (value) => {
    if (typeof value !== 'string') {
        value = String(value ?? '');
    }
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

const getAllDocumentsForUser = async (userId) => {
    console.log("Fetching all documents for user:", userId);
    const foundDocuments =await userModel.findById(userId).select('_id username email').populate({
        path: 'collaborations',
        select: 'title _id createdAt updatedAt',
        options: { sort: { updatedAt: -1 }, limit: 10 }
    });
    console.log("Found documents:", foundDocuments);
    return foundDocuments;
}

const searchDocumentsByTitleForUser = async (title, userId) => {
    console.log("Searching documents with title:", escapeRegex(title), "for user:", userId);
    const foundDocumentByUser = await DocumentModel.aggregate([
        {
            $match: {
                title: { $regex: escapeRegex(title), $options: 'i' }
            }
        }, {
            $lookup: {
                from: 'permissions',
                localField: 'collaborators',
                foreignField: '_id',
                as: 'collaborators'
            }
        }, {
            $match: {
                collaborators: {
                    $elemMatch: {
                        user: new mongoose.Types.ObjectId(userId),
                        role: { $in: ['owner', 'editor', 'viewer'] }
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'users',
                let: { collaboratorUsers: '$collaborators.user' },
                pipeline: [
                    {
                        $match: {
                            $expr: { $in: ['$_id', '$$collaboratorUsers'] }
                        }
                    },
                    {
                        $project: {
                            username: 1,
                            email: 1,
                            profilePic: 1,
                            googleProfilePic: 1
                        }
                    }
                ],
                as: 'users'
            }
        },
        {
            $addFields: {
                collaborators: {
                    $map: {
                        input: '$collaborators',
                        as: 'collab',
                        in: {
                            role: '$$collab.role',
                            user: {
                                $arrayElemAt: [{
                                    $filter: {
                                        input: '$users',
                                        as: 'u',
                                        cond: { $eq: ['$$u._id', '$$collab.user'] }
                                    }
                                }, 0
                                ]
                            }
                        }
                    }
                }
            }
        },
        {
            $project: {
                title: 1,
                // content: 1,
                collaborators: 1,
                createdAt: 1,
                updatedAt: 1,
            }
        }
    ])

    console.log("Found documents:", foundDocumentByUser);

    return foundDocumentByUser;
}

const createDocument = async (documentData, owner) => {
    const session = await mongoose.startSession();

    session.startTransaction()
    try {

        const newDocument = await DocumentModel.create(documentData);

        const newPermission = await PermissionModel.create({
            role: 'owner',
            document: newDocument._id,
            user: owner
        })

        const updatedNewDocument = await DocumentModel.findByIdAndUpdate(newDocument._id, {
            $addToSet: { collaborators: newPermission._id },
        }, { new: true }).exec();

        const updatedUser = await userModel.findByIdAndUpdate(owner, { $addToSet: { collaborations: newDocument._id } }, { new: true }).exec();

        await session.commitTransaction();
        session.endSession();

        return { newDocument: updatedNewDocument, updatedUser };
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        throw err;
    }
}

const getDocumentById = async (documentId) => {
    return DocumentModel.findById(documentId).populate('collaborators').populate('user', "username email").exec();
}

const updateDocument = async (documentId, updatedData) => {
    const updatedFile = await DocumentModel.findByIdAndUpdate(documentId, updatedData, { new: true })
        .populate(
            {
                path: 'collaborators',
                populate: {
                    path: 'user',
                    select: 'username email profilePic googleProfilePic'
                }
            }).exec();

    console.log("Updated document:", updatedFile);
    return updatedFile;
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
    addCollaborator,
    searchDocumentsByTitleForUser
}