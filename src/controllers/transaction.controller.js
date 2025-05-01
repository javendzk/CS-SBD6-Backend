const transactionRepository = require("../repositories/transaction.repository.js");
const itemRepository = require("../repositories/item.repository.js");
const userRepository = require("../repositories/user.repository.js");
const baseResponse = require('../utils/baseResponse.util.js');

exports.createTransaction = async (req, res) => {
    try {
        const { item_id, quantity, user_id } = req.body;
        
        if (!item_id || !quantity || !user_id) {
            return baseResponse(res, false, 400, "Missing item_id, quantity or user_id", null);
        }
        
        const quantityNum = parseInt(quantity);
        
        if (isNaN(quantityNum) || quantityNum <= 0) {
            return baseResponse(res, false, 400, "Quantity must be > 0", null);
        }
        
        const item = await itemRepository.getItemById(item_id);
        if (!item) {
            return baseResponse(res, false, 404, "Item not found", null);
        }
        
        const user = await userRepository.getUserById(user_id);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        
        if (item.stock < quantityNum) {
            return baseResponse(res, false, 400, "Stock tidak enough", null);
        }
        
        const total = item.price * quantityNum;
        
        const newTransaction = await transactionRepository.createTransaction({
            user_id,
            item_id,
            quantity: quantityNum,
            total,
            status: 'pending'
        });
        
        return baseResponse(res, true, 201, "Transaction created", newTransaction);
    } catch (error) {
        return baseResponse(res, false, 500, "Failed to create transaction", error);
    }
};

exports.payTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return baseResponse(res, false, 400, "Missing transaction ID", null);
        }
        
        const transaction = await transactionRepository.getTransactionById(id);

        if (!transaction) {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }
        
        if (transaction.status === 'paid') {
            return baseResponse(res, false, 400, "Transaction already bayar'd", null);
        }
        
        const user = await userRepository.getUserById(transaction.user_id);
        if (!user) {
            return baseResponse(res, false, 404, "User not found", null);
        }
        
        if (user.balance < transaction.total) {
            return baseResponse(res, false, 400, "Balance not enough", null);
        }
        
        const item = await itemRepository.getItemById(transaction.item_id);
        if (!item) {
            return baseResponse(res, false, 404, "Item not found", null);
        }
        
        if (item.stock < transaction.quantity) {
            return baseResponse(res, false, 400, "Stock tidak enough", null);
        }
        
        await userRepository.updateUser({
            id: user.id,
            name: user.name,
            email: user.email,
            password: user.password,
            balance: user.balance - transaction.total
        });
        
        await itemRepository.updateItem({
            id: item.id,
            name: item.name,
            price: item.price,
            store_id: item.store_id,
            image_url: item.image_url,
            stock: item.stock - transaction.quantity
        });
        
        const updatedTransaction = await transactionRepository.updateTransactionStatus(id, 'paid');
        
        return baseResponse(res, true, 200, "Payment successful", updatedTransaction);
    } catch (error) {
        return baseResponse(res, false, 500, "Failed to pay", error);
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return baseResponse(res, false, 400, "Missing transaction ID", null);
        }
        
        const transaction = await transactionRepository.getTransactionById(id);
        if (!transaction) {
            return baseResponse(res, false, 404, "Transaction not found", null);
        }
        
        const deletedTransaction = await transactionRepository.deleteTransaction(id);
        
        return baseResponse(res, true, 200, "Transaction deleted", deletedTransaction);
    } catch (error) {
        return baseResponse(res, false, 500, "Failed to delete transaction", error);
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await transactionRepository.getAllTransactions();
        
        if (!transactions || transactions.length === 0) {
            return baseResponse(res, true, 200, "No transactions in db", []);
        }
        
        return baseResponse(res, true, 200, "Transactions found", transactions);
    } catch (error) {
        return baseResponse(res, false, 500, "Failed to fetch transactions", error);
    }
};
