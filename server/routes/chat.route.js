import { Router } from 'express';
import Chat from '../infra/db/models/chat.model.js';
import { protectMiddleware } from '../middleware/auth.middleware.js';
import { handleRetriever } from '../services/retriever.services.js';
import { generateAnswer } from '../services/ai.services.js';
const router = Router({ mergeParams: true });

router.get('/', protectMiddleware, async (req, res) => {
    try {
        const workspaceId = req.params.workspaceId;
        if (!workspaceId) {
            return res.status(400).json({
                error: "workspaceId required"
            });
        }
        const chats = await Chat.find({ workspace: workspaceId, userId: req.user.userId }).select('role content').sort({ createdAt: -1 });
        res.status(200).json({
            chats: chats,
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message,
        });
    }
});

//take user question -> fetch relevant vectors -> give to llm -> and return the answer
router.post('/', protectMiddleware, async (req, res) => {
    try {
        const userQuery = req.body.query;
        const activePdfs = req.body.activePdfs;
        const workspaceId = req.params.workspaceId;

        if (!userQuery || activePdfs.length === 0) {
            res.status(400).json({
                error: "userQuery required"
            });
            return;
        }

        const similarityResult = await handleRetriever(userQuery, activePdfs);
        const llmAnswer = await generateAnswer(userQuery, similarityResult);

        if (llmAnswer) {
            await Chat.insertMany([{
                workspaceId,
                userId: req.user.userId,
                role: "user",
                content: userQuery,
            }, {
                workspaceId,
                userId: req.user.userId,
                role: "assistant",
                content: llmAnswer,
            }
            ]);
        };

        res.status(200).json({
            assistant: llmAnswer
        });

    } catch (error) {
        console.log(error.message);
    }
});


export default router;