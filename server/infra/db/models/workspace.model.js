import mongoose, { Schema } from "mongoose";

const WorkspaceSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true,
        unique: false
    },
}, { timestamps: true });

const Workspace = mongoose.model('Workspace', WorkspaceSchema);

export default Workspace;