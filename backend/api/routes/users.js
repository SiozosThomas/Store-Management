const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const UserController = require('../controllers/users');

router.post('/signup', UserController.createUser);

router.post('/login', UserController.login);

router.delete('/:userId', checkAuth, UserController.deleteUser);

module.exports = router;