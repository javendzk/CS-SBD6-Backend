const db = require("../configs/db.config.js");

exports.createTransaction = async (transaction) => {
    try {
        const res = await db.query(
            "INSERT INTO transactions (user_id, item_id, quantity, total, status) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
            [transaction.user_id, transaction.item_id, transaction.quantity, transaction.total, transaction.status]
        );
        
        return res.rows[0];
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.getTransactionById = async (id) => {
    try {
        const res = await db.query(
            "SELECT * FROM transactions WHERE id = $1;",
            [id]
        );
        
        return res.rows[0];
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.updateTransactionStatus = async (id, status) => {
    try {
        const res = await db.query(
            "UPDATE transactions SET status = $2 WHERE id = $1 RETURNING *;",
            [id, status]
        );
        
        return res.rows[0];
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.deleteTransaction = async (id) => {
    try {
        const res = await db.query(
            "DELETE FROM transactions WHERE id = $1 RETURNING *;",
            [id]
        );
        
        return res.rows[0];
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.getAllTransactions = async () => {
    try {
        const res = await db.query(`
            SELECT 
                t.*,
                json_build_object(
                    'id', u.id,
                    'name', u.name,
                    'email', u.email,
                    'password', u.password,
                    'balance', u.balance,
                    'created_at', u.created_at
                ) as user,
                json_build_object(
                    'id', i.id,
                    'name', i.name,
                    'price', i.price,
                    'store_id', i.store_id,
                    'image_url', i.image_url,
                    'stock', i.stock,
                    'created_at', i.created_at
                ) as item
            FROM 
                transactions t
                JOIN users u ON t.user_id = u.id
                JOIN items i ON t.item_id = i.id
        `);
        
        return res.rows;
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};
