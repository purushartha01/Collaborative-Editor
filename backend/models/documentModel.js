import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: '',
    },
    collaborators: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Permission',
    }]
}, {
    timestamps: true
})

const DocumentModel = mongoose.model('Document', documentSchema);

export default DocumentModel;