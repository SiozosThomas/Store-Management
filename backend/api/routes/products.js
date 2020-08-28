const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const ProductController = require('../controllers/products');

router.get('/', checkAuth, ProductController.getProducts);

router.post('/', checkAuth, ProductController.createProduct);

router.delete('/:productId', checkAuth, ProductController.deleteProduct);

module.exports = router;