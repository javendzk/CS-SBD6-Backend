const db = require("../configs/db.config.js")
const bcrypt = require("bcrypt");

exports.createUser = async (user) => {
    try {
        const checkEmail = await db.query(
            "SELECT * FROM users WHERE email = $1",
            [user.email]
        );
        
        if (checkEmail.rows.length > 0) {
            console.error ("Email already used");
            return null;
        }
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(user.password, salt);
                
        const res = await db.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;",
            [user.name, user.email, hashedPassword]
        );

        return res.rows[0];
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.authUser = async (user) => {
    try {
        const res = await db.query(
            "SELECT * FROM users WHERE email = $1;",
            [user.email]
        );

        if (res.rows.length > 0) {
            const storedHashedPassword = res.rows[0].password;  
            
            const passwordMatch = await bcrypt.compare(user.password, storedHashedPassword);
            
            if (passwordMatch) {
                return res.rows[0];
            } else {
                console.error("Password mismatch");
                return null;
            }
        }
        
        console.error("User not found");
        return null;
        
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.getUser = async (user) => {
    try {
        const res = await db.query(
            "SELECT * FROM users WHERE email = $1;",
            [user.email]
        );

        if (res.rows.length === 0) {    
            console.error("User not found");
            return null;
        }

        return res.rows[0];
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.getUserById = async (id) => {
    try {
        const res = await db.query(
            "SELECT * FROM users WHERE id = $1;",
            [id]
        );
        
        if (res.rows.length === 0) {    
            console.error("User not found");
            return null;
        }

        return res.rows[0];
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.updateUser = async (user) => {
    try {
        const checkUser = await db.query(
            "SELECT * FROM users WHERE id = $1",
            [user.id]
        );
        
        if (checkUser.rows.length === 0) {
            console.error("User not found");
            return null;
        }
        
        if (user.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
        }
        
        const res = await db.query(
            "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *",
            [user.name, user.email, user.password, user.id]
        );
        
        return res.rows[0];
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.deleteUser = async (user) => {
    try {
        const checkUser = await db.query(
            "SELECT * FROM users WHERE id = $1",
            [user.id]
        );
        
        if (checkUser.rows.length === 0) {
            console.error("User not found");
            return null;
        }
        
        const res = await db.query(
            "DELETE FROM users WHERE id = $1 RETURNING *",
            [user.id]
        );
        
        return res.rows[0];
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.topUpUserBalance = async (data) => {
    try {
        const checkUser = await db.query(
            "SELECT * FROM users WHERE id = $1",
            [data.id]
        );
        
        if (checkUser.rows.length === 0) {
            console.error("User not found");
            return null;
        }

        if (data.amount <= 0) {
            console.error("Amount must be > 0");
            return null;
        }
        
        const currentBalance = checkUser.rows[0].balance || 0;
        const newBalance = currentBalance + data.amount;
        
        const res = await db.query(
            "UPDATE users SET balance = $1 WHERE id = $2 RETURNING *",
            [newBalance, data.id]
        );
        
        return res.rows[0];
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};