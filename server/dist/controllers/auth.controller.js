import mongoose from "mongoose";
import User from "../dbmodels/user.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env";
export const signUp = async (request, response, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { username, email, password } = request.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const error = new Error("user already existss bruh..");
            error.statusCode = 409;
            throw error;
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUsers = await User.create([
            {
                username,
                email,
                password: hashedPassword,
            },
        ], { session });
        const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
        });
        await session.commitTransaction();
        session.endSession();
        response.status(201).json({
            success: true,
            message: "User created successfully",
            data: {
                token,
                user: newUsers[0],
            },
        });
    }
    catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};
export const signIn = async (request, response, next) => {
    try {
        const { email, password } = request.body;
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
        response.status(200).json({
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
