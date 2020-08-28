const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const TableController = require('../controllers/tables');

router.get('/', checkAuth, TableController.getTables);

router.post('/', checkAuth, TableController.createTable);

router.post('/addOrder', checkAuth, TableController.addOrder);

router.delete('/:orderId/:tableId', checkAuth, TableController.deleteOrder);

router.delete('/:tableId', checkAuth, TableController.deleteTable);

module.exports = router;