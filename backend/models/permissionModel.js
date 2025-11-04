import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ['owner', 'editor', 'viewer'],
        default: 'viewer',
        required: true
    },
    document: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const PermissionModel = mongoose.model('Permission', permissionSchema);

export default PermissionModel;