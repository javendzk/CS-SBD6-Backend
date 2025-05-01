const db = require("../configs/db.config.js")

exports.getAllStores = async () => {
    try {
        const res = await db.query("SELECT * FROM stores;");
        return res.rows;
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.createStore = async (store) => {
    try {
        const res = await db.query(
            "INSERT INTO stores (name, address) VALUES ($1, $2) RETURNING *;",
            [store.name, store.address]
        );

        return res.rows[0];
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.updateStore = async (store) => {
    try {
        const res = await db.query(
            "UPDATE stores SET name = $2, address = $3 WHERE id = $1 RETURNING *;",
            [store.id, store.name, store.address]
        );

        return res.rows[0];
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.deleteStore = async (store) => {
    try {
        const res = await db.query(
            "DELETE from stores where id = $1 RETURNING *;",
            [store.id]
        );

        return res.rows[0];
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};

exports.getStore = async (store) => {
    try {
        const res = await db.query(
           "SELECT * FROM stores WHERE id = $1;",
            [store.id]
        );

        return res.rows[0];
    } catch (error) {
        console.error("Query execution error", error);
        throw error;
    }
};