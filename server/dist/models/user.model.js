import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "username is required"],
        trim: true, //removes whitespaces
        minLength: 2,
        maxLength: 50,
    },
    email: {
        type: String,
        required: [true, "email is required"],
        trim: true,
        unique: true,
        lowercase: true,
        minLength: 5,
        maxLength: 255,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please fill a valid email address",
        ],
    },
    password: {
        type: String,
        required: [true, "password is required"],
        minLength: 6,
    },
}, { timestamps: true });
const User = mongoose.model("User", userSchema);
export default User;
