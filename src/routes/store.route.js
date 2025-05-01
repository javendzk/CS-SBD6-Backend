const storeController = require("../controllers/store.controller.js");
const express = require('express');
const router = express.Router();

router.get('/getAll', storeController.getAllStore);
router.post('/create', storeController.createStore);
router.put('/', storeController.updateStore);
router.get('/:id', storeController.getStore);
router.delete('/:id', storeController.deleteStore);

module.exports = router;