const express = require('express');
const router = express.Router();
const roleControllers = require('../controllers/roleControllers')

router.get('/list', roleControllers.list);

module.exports = router;