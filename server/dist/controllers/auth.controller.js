import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
export const signUp = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("User already exists");
            error.statusCode = 409;
            throw error;
        }
        //hashing password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUser,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const signIn = async (req, res, next) => { };
export const signOut = async (req, res, next) => { };
