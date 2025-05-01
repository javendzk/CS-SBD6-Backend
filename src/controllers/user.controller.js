const userRepository = require("../repositories/user.repository.js");
const baseResponse = require("../utils/baseResponse.util.js");
const passwordRegex = /^(?=.*\d)(?=.*[\W_]).{8,}$/;

exports.createUser = async (req, res) => {
    try {
        const { email, password, name } = req.query;
        
        if (!email || !password || !name) {
            return baseResponse(res, false, 400, "Missing email, password, or name", null);
        }

        if (!passwordRegex.test(password)) {
            return baseResponse(res, false, 400, "Password minimum 8 char, 1 number, 1 special character", null);
        }

        const result = await userRepository.createUser({email, password, name});

        if (!result) {
            return baseResponse(res, false, 400, "Email already used", null);
        }

        return baseResponse(res, true, 201, "User registered", result);
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, "Failed to register user", null);
    }
};

exports.authUser = async (req, res) => {
    try {
        const { email, password } = req.query;
        
        if (!email || !password) {
            return baseResponse(res, false, 400, "Missing email or password", null);
        }

        const result = await userRepository.authUser({email, password});

        if (!result) {
            return baseResponse(res, false, 401, "Invalid credentials", null);
        }

        return baseResponse(res, true, 200, "Login successful", result);
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, "Failed user login", null);
    }
};

exports.getUser = async (req, res) => {
    try {
        const { email } = req.params;
        
        if (!email) {
            return baseResponse(res, false, 400, "Missing user email", null);
        }
        
        const result = await userRepository.getUser({email});

        if (!result) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        return baseResponse(res, true, 200, "User retrieved", result);
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, "Failed to get user", null);
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = req.body;

        if (!user.id || !user.email || !user.password || !user.name) {
            return baseResponse(res, false, 400, "Missing user id, email, password, or name", null);
        }

        if (user.password && !passwordRegex.test(user.password)) {
            return baseResponse(res, false, 400, "Password minimum 8 char, 1 number, 1 special character", null);
        }

        const result = await userRepository.updateUser(user);

        if (!result) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        return baseResponse(res, true, 200, "User updated", result);
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, "Failed to update user", null);
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return baseResponse(res, false, 400, "Missing user ID", null);
        }
        
        const result = await userRepository.deleteUser({id});

        if (!result) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        return baseResponse(res, true, 200, "User deleted", result);
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, "Failed to delete user", null);
    }
};

exports.topUpUserBalance = async (req, res) => {
    try {
        const { id, amount } = req.query;
        
        if (!id) {
            return baseResponse(res, false, 400, "Missing user ID", null);
        }

        if (!amount || isNaN(amount) || parseInt(amount) <= 0) {
            return baseResponse(res, false, 400, "Amount must be > 0", null);
        }

        const result = await userRepository.topUpUserBalance({
            id,
            amount: parseInt(amount)
        });

        if (!result) {
            return baseResponse(res, false, 404, "User not found", null);
        }

        return baseResponse(res, true, 200, "Top up successful", result);
    } catch (error) {
        console.error(error);
        return baseResponse(res, false, 500, "Failed to top up user balance", null);
    }
};
