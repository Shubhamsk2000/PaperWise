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

        const chats = await Chat.find({ workspaceId: workspaceId, userId: req.user.userId }).select('role content createdAt').sort({ createdAt: 1 });

        res.status(200).json({
            chats: chats,
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            error: error.message,
        });
    }
});

//take user question -> fetch relevant vectors -> give to llm -> and return the answer
router.post('/', protectMiddleware, async (req, res) => {
    try {

        const workspaceId = req.params.workspaceId;
        const { query: userQuery, activePdfs } = req.body;

        if (!userQuery || activePdfs?.length === 0) {
            return res.status(400).json({
                error: "Query and active PDFS are required"
            });
        }

        const similarityResult = await handleRetriever(userQuery, activePdfs);

        const llmAnswer = await generateAnswer(userQuery, similarityResult);


        const savedMessages = await Chat.insertMany([{
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

        return res.status(200).json({
            newMessages: savedMessages
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            error: error.message
        });
    }
});


export default router;