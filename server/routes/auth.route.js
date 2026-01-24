import { Router } from "express";
import User from '../infra/db/models/user.model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { protectMiddleware } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/signup', async (req, res) => {
    try {
        const { userName, email } = req.body;
        let password = req.body.password;

        if (!userName || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const hash = await bcrypt.hash(password, 10);

        const newUser = await User.create({ userName, email, password: hash });
        res.status(201).json({
            status: "success",
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                message: "This email is already registered. Please try logging in.",
            });
        }
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.message,
            });
        }

        res.status(500).json({
            message: {
                error_name: error.name,
                error_message: error.message
            }
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });

        if (!user) {
            res.status(400).json({
                status: "faile",
                message: "Please Sign Up before Login"
            });
        }

        let validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            res.status(401).send("Password is wrong.");
        }

        const token = jwt.sign(
            {
                userId: user._id,
                userName: user.userName
            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({
            status: "success",
            token: token,
            data: {
                userName: user.userName,
                email: user.email
            }
        });

    } catch (error) {
        console.log(error.message);
    }
});

router.get('/me', protectMiddleware, (req, res) => {
    res.status(200).json({
        status: "success",
        message: "authorized",
        data: req.user
    });
});
export default router;