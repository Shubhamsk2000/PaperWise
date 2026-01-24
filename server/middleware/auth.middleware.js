import jwt from 'jsonwebtoken';

export const protectMiddleware = (req, res, next) => {
    const authHeader = req.headers["authorization"];

    if (authHeader && authHeader.startsWith('Bearer')) {
        try {
            const token = authHeader.split(" ")[1];

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();

        } catch (error) {
            res.status(401).json({
                status: "fail",
                message: "Not authorized, token failed",
            });
        }
    } else {
        res.status(401).json({
            status: "fail",
            message: "Not authorized, token failed",
        });
    }
};