import { Router } from 'express';
import { protectMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', protectMiddleware, (req, res) => {
    try {
        
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            status: "fail",
            message: error.message,
        });
    }
});


export default router;