const storeRepository = require("../repositories/store.repository.js");
const baseResponse = require('../utils/baseResponse.util.js');

exports.getAllStore = async (req, res) => {
    try {
        const stores = await storeRepository.getAllStores();
        return baseResponse(res, true, 200, "Stores found", stores);
    } catch (error) {
        return baseResponse(res, false, 500, "Failed to query all store", error);
    }
};

exports.createStore = async (req, res) => {
    try {
        const { name, address } = req.body;
        
        if (!name || !address) {
            return baseResponse(res, false, 400, "Missing store name or address", null);
        }
        
        const newStore = await storeRepository.createStore(req.body);

        return baseResponse(res, true, 201, "Store created", newStore);
    } catch (error) {
        return baseResponse(res, false, 500, "Failed to create store", error);
    }
};

exports.getStore = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return baseResponse(res, false, 400, "Missing store ID", null);
        }

        const store = await storeRepository.getStore(req.params);
        
        if (!store) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        
        return baseResponse(res, true, 200, "Store found", store);
    } catch (error) {
        return baseResponse(res, false, 500, "Failed to query store", error);
    }
};

exports.deleteStore = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return baseResponse(res, false, 400, "Missing store ID", null);
        }

        const deletedStore = await storeRepository.deleteStore(req.params);
        
        if (!deletedStore) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        
        return baseResponse(res, true, 200, "Store deleted", deletedStore);
    } catch (error) {
        return baseResponse(res, false, 500, "Failed to delete store", error);
    }
};

exports.updateStore = async (req, res) => {
    try {
        const { id, name, address } = req.body;
        
        if (!id || !name || !address) {
            return baseResponse(res, false, 400, "Missing store ID, name, or address", null);
        }
        
        const updatedStore = await storeRepository.updateStore(req.body);
        
        if (!updatedStore) {
            return baseResponse(res, false, 404, "Store not found", null);
        }
        
        return baseResponse(res, true, 200, "Store updated ", updatedStore);
    } catch (error) {
        return baseResponse(res, false, 500, "Failed to update store", error);
    }
};

