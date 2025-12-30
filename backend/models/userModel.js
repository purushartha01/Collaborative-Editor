import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String
    },
    googleId: {
        type: String,
        default: null
    },
    googleProfilePic: {
        type: String
    },
    profilePic: {
        type: String,
        default: null
    },
    collaborations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
        default: []
    }],
    collabInvites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
    }]
}, {
    timestamps: true
});

const userModel = mongoose.model('User', userSchema);

export default userModel;