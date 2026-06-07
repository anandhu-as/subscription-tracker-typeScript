import mongoose from "mongoose";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        //create a new user
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("user already exists");
            error.statusCode = 409;
            throw error;
        }
        //hashing the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUsers = await User.create([{ name, email, password: hashedPassword }], { session });
        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
        //saving the changes
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUsers[0],
            },
        });
    }
    catch (error) {
        //if anything goes wrong we can rollback all the changes
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};
export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            const error = new Error("user not found");
            error.statusCode = 404;
            throw error;
        }
        const isPasswordvalid = await bcrypt.compare(password, user.password);
        if (!isPasswordvalid) {
            const error = new Error("Password is invalid");
            error.statusCode = 401;
            throw error;
        }
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
        res.status(201).json({
            success: true,
            message: "User loggedin successfully",
            data: {
                token,
                user,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
export const signOut = async (req, res, next) => {
    return res.status(200).json({
        success: true,
        message: "Logged out successfully",
    });
};
