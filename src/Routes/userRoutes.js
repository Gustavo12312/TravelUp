const express = require('express');
const router = express.Router();
const middleware = require('../middleware')
const userControllers = require('../controllers/userControllers')

router.get('/list', middleware, userControllers.list);
router.get('/get/:id', userControllers.get);
router.post('/register', userControllers.register);
router.post('/login', userControllers.login);

module.exports = router;