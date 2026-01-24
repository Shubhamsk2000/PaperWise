import { Router } from 'express';
import { protectMiddleware } from '../middleware/auth.middleware.js';
import Workspace from '../infra/db/models/workspace.model.js';
import Pdf from '../infra/db/models/pdf.model.js';
import { isValidObjectId } from 'mongoose';

const router = Router();

router.get('/', protectMiddleware, async (req, res) => {
    try {
        const workspaces = await Workspace.find({ userId: req.user.userId }).sort({createdAt: -1}).exec();
        res.status(200).json({
            status: "success",
            workspaces
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: "fail",
            message: error.message,
        });
    }
});

router.post('/', protectMiddleware, async (req, res) => {
    try {
        const name = req.body ? req.body.name : "Untitled Workspace";

        const newWorkspace = await Workspace.create({
            userId: req.user.userId,
            name: name
        });

        res.status(201).json({
            status: "success",
            message: "Workspace created",
            workspaceId: newWorkspace._id,
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: "fail",
            message: error.message,
        });
    }
});

router.get('/:workspaceId', protectMiddleware, async (req, res) => {
    try {
        const workspaceId = req.params.workspaceId;

        if (!isValidObjectId(workspaceId)) {
            res.status(404).json({
                status: "fail",
                message: "Workspace does not exist"
            });
            return;
        }

        const workspace = await Workspace.findOne({ _id: workspaceId, userId: req.user.userId }).select('name');

        if (workspace === null) {
            res.status(404).json({
                status: "fail",
                message: "Workspace does not exist"
            });
            return;
        }

        const pdfs = await Pdf.find({ workspaceId: workspaceId, userId: req.user.userId });

        res.status(200).json({
            name: workspace.name,
            workspaceId: workspace._id,
            pdf: pdfs,
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: "fail",
            message: error.message,
        });
    }
});

export default router;