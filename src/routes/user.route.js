const userController = require("../controllers/user.controller.js");
const express = require('express');
const router = express.Router();

router.post('/register', userController.createUser);
router.post('/login', userController.authUser);
router.put('/', userController.updateUser);
router.get('/:email', userController.getUser);
router.delete('/:id', userController.deleteUser);
router.post('/topUp', userController.topUpUserBalance);

module.exports = router;