import { Router } from 'express';
import { protectMiddleware } from '../middleware/auth.middleware.js';
import Pdf from '../infra/db/models/pdf.model.js';
import multer from 'multer';
import { uploadPdfService } from '../services/pdfIngestion.services.js';

const router = Router({ mergeParams: true });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '_' + file.originalname);
    }
});
const upload = multer({ storage });

//get all the pdfs for workspace
router.get('/', protectMiddleware, async (req, res) => {
    try {
        const workspaceId = req.params.workspaceId;

        const pdfs = await Pdf.find({ workspaceId: workspaceId, userId: req.user.userId })
        .select('_id fileName')
        .sort({ createdAt: -1 });

        res.status(200).json({
            pdfs: pdfs
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message,
        });
    }
});

router.post('/', protectMiddleware, upload.single('pdf'),async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            error: "File upload required"
        });
    }
    try {
        const workspaceId = req.params.workspaceId;

        if (!workspaceId) {
            return res.status(400).json({
                message: "workspaceId is required",
            });
        }

        const pdf = await uploadPdfService({
            userId: req.user.userId,
            workspaceId: workspaceId,
            file: req.file
        });
        res.status(200).json({
            pdf: pdf
        });

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: error.message,
        });
    }
});

export default router;