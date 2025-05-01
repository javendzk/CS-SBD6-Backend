const db = require("../configs/db.config.js");

exports.getAllItems = async () => {
    try {
        const res = await db.query("SELECT * FROM items;");
        return res.row;
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.createItem = async (item) => {
    try {
        const res = await db.query(
            "INSERT INTO items (name, price, store_id, image_url, stock) VALUES ($1, $2, $3, $4, $5) RETURNING *;",
            [item.name, item.price, item.store_id, item.image_url, item.stock]
        );
        
        return res.rows[0];
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.getItemById = async (id) => {
    try {
        const res = await db.query(
            "SELECT * FROM items WHERE id = $1;",
            [id]
        );
        
        return res.rows[0];
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.getItemsByStoreId = async (storeId) => {
    try {
        const res = await db.query(
            "SELECT * FROM items WHERE store_id = $1;",
            [storeId]
        );
        
        return res.rows;
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.updateItem = async (item) => {
    try {
        const res = await db.query(
            "UPDATE items SET name = $2, price = $3, store_id = $4, image_url = $5, stock = $6 WHERE id = $1 RETURNING *;",
            [item.id, item.name, item.price, item.store_id, item.image_url, item.stock]
        );
        
        return res.rows[0];
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.updateItemStock = async (id, newStock) => {
    try {
        const res = await db.query(
            "UPDATE items SET stock = $2 WHERE id = $1 RETURNING *;",
            [id, newStock]
        );
        
        return res.rows[0];
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.deleteItem = async (id) => {
    try {
        const res = await db.query(
            "DELETE FROM items WHERE id = $1 RETURNING *;",
            [id]
        );
        
        return res.rows[0];
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.checkStoreExists = async (storeId) => {
    try {
        const res = await db.query(
            "SELECT EXISTS(SELECT 1 FROM stores WHERE id = $1);",
            [storeId]
        );
        
        return res.rows[0].exists;
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};
