const itemRepository = require("../repositories/item.repository.js");
const baseResponse = require('../utils/baseResponse.util.js');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  secure: true
});

const uploadImageToCloudinary = async (file) => {
    try {
        const b64 = Buffer.from(file.buffer).toString('base64');
        const dataURI = "data:" + file.mimetype + ";base64," + b64;
        
        const result = await cloudinary.uploader.upload(dataURI, {
            resource_type: 'auto',
            unique_filename: true
        });
        
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading to cloudinary:', error);
        throw error;
    }
};

exports.createItem = async (req, res) => {
    try {
        const { name, price, store_id, stock } = req.body;
        
        if (!name || !price || !store_id || !stock || !req.file) {
            return baseResponse(res, false, 400, "Missing item, name, price, store_id, stock or image", null);
        }
        
        const priceNum = parseInt(price);
        const stockNum = parseInt(stock);
        
        if (isNaN(priceNum) || isNaN(stockNum)) {
            return baseResponse(res, false, 400, "Price and stock must be integer", null);
        }
        
        const storeExists = await itemRepository.checkStoreExists(store_id);
        if (!storeExists) {
            return baseResponse(res, false, 404, "Store doesn't exist", null);
        }
        
        let image_url = null;
        if (req.file) {
            image_url = await uploadImageToCloudinary(req.file);
        }
        
        const newItem = await itemRepository.createItem({
            name,
            price: priceNum,
            store_id,
            image_url,
            stock: stockNum
        });
        
        return baseResponse(res, true, 201, "Item created", newItem);
    } catch (error) {
        return baseResponse(res, false, 500, "Failed to create item", error);
    }
};

exports.getAllItems = async (req, res) => {
    try {
        const items = await itemRepository.getAllItems();
        return baseResponse(res, true, 200, "Items found", items);
    } catch (error) {
        return baseResponse(res, false, 500, "Failed to get items", error);
    }
};

exports.getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return baseResponse(res, false, 400, "Missing item ID", null);
        }
        
        const item = await itemRepository.getItemById(id);
        
        if (!item) {
            return baseResponse(res, false, 404, "Item not found", null);
        }
        
        return baseResponse(res, true, 200, "Item found", item);
    } catch (error) {
        return baseResponse(res, false, 500, "Failed to get item", error);
    }
};

exports.getItemsByStoreId = async (req, res) => {
    try {
        const { store_id } = req.params;
        
        if (!store_id) {
            return baseResponse(res, false, 400, "Missing store ID", null);
        }
        
        const storeExists = await itemRepository.checkStoreExists(store_id);
        if (!storeExists) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        
        const items = await itemRepository.getItemsByStoreId(store_id);
        return baseResponse(res, true, 200, "Items found", items);
    } catch (error) {
        return baseResponse(res, false, 500, "Failed to get items", error);
    }
};

exports.updateItem = async (req, res) => {
    try {
        const { id, name, price, store_id, stock } = req.body;
        
        if (!id || !name || !price || !store_id || !stock) {
            return baseResponse(res, false, 400, "Missing item ID, name, price, store_id, or stock", null);
        }
        
        const priceNum = parseInt(price);
        const stockNum = parseInt(stock);
        
        if (isNaN(priceNum) || isNaN(stockNum)) {
            return baseResponse(res, false, 400, "Price and stock must be integer", null);
        }
        
        const existingItem = await itemRepository.getItemById(id);
        if (!existingItem) {
            return baseResponse(res, false, 404, "Item not found", null);
        }
        
        const storeExists = await itemRepository.checkStoreExists(store_id);
        if (!storeExists) {
            return baseResponse(res, false, 404, "Store doesn't exist", null);
        }
        
        let image_url = existingItem.image_url;
        if (req.file) {
            image_url = await uploadImageToCloudinary(req.file);
        }
        
        const updatedItem = await itemRepository.updateItem({
            id,
            name,
            price: priceNum,
            store_id,
            image_url,
            stock: stockNum
        });
        
        return baseResponse(res, true, 200, "Item updated", updatedItem);
    } catch (error) {
        return baseResponse(res, false, 500, "Failed to update item", error);
    }
};

exports.deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return baseResponse(res, false, 400, "Missing item ID", null);
        }
        
        const deletedItem = await itemRepository.deleteItem(id);
        
        if (!deletedItem) {
            return baseResponse(res, false, 404, "Item not found", null);
        }
        
        return baseResponse(res, true, 200, "Item deleted", deletedItem);
    } catch (error) {
        return baseResponse(res, false, 500, "Failed to delete item", error);
    }
};
