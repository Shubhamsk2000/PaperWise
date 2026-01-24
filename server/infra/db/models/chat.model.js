import { Schema, mongoose } from "mongoose";

const ChatSchema = new Schema({
    workspaceId: {
        type: Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ["user", "assistant", "system"],
        require: true,
    },
    content: {
        type: String,
        required: true,
    },

}, { timestamps: true });

const Chat = mongoose.model('Chat', ChatSchema);

export default Chat;