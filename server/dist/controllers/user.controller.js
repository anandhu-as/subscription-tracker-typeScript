import User from "../dbmodels/user.model";
export const getUsers = async (request, response, next) => {
    try {
        const users = await User.find();
        response.status(200).json({ success: true, data: users });
    }
    catch (error) {
        next(error);
    }
};
export const getUserById = async (request, response, next) => {
    try {
        const user = await User.findById(request.params.id).select("-password");
        if (!user) {
            const error = new Error("User not found");
            error.statusCode = 404;
            throw error;
        }
        response.status(200).json({ success: true, data: user });
    }
    catch (error) {
        next(error);
    }
};
