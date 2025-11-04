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
        type: String,
        required: true
    },
    collaborations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'documents',
        default: []
    }]
}, {
    timestamps: true
});

const userModel = mongoose.model('users', userSchema);

export default userModel;