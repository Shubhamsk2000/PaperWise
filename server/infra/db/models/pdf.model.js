import mongoose, { Schema } from "mongoose";

const PdfSchema = new Schema({
    workspaceId: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fileName: {
        type: String,
        required: true
    },
    filePath: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['uploaded', 'ready', 'failed'],
        default: 'uploaded',
    }
}, { timestamps: true });

const Pdf = mongoose.model('Pdf', PdfSchema);

export default Pdf;