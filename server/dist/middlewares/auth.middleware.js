import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_SECRET } from "../config/env.js";
export const authorize = async (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            token = authHeader.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({
                message: "Unauthorized: No token provided",
            });
        }
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                message: "Unauthorized: User not found",
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        return res.status(401).json({
            message: "Unauthorized",
            error: message,
        });
    }
};
export default authorize;
