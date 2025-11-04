import PermissionModel from "../models/permissionModel.js";

const grantPermissionBasedOnRole = (role, userId, documentId) => {
    // Logic to grant permission
    return PermissionModel.create({
        role: role,
        user: userId,
        document: documentId
    });
}

const revokePermission = (permissionId) => {
    return PermissionModel.findByIdAndDelete(permissionId).exec();
}

const checkPermission = async (userId, documentId, requiredRole) => {
    const permission = await PermissionModel.findOne({ user: userId, document: documentId }).exec();
    return permission && permission.role === requiredRole;
}


export {
    grantPermissionBasedOnRole,
    revokePermission,
    checkPermission
}