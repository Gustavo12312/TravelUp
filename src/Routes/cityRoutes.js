const express = require('express');
const router = express.Router();
const cityControllers = require('../Controllers/cityControllers'); // Adjust this path if necessary

router.get('/list', cityControllers.list);
router.post('/create', cityControllers.create);
router.get('/get/:id', cityControllers.get);
router.put('/update/:id', cityControllers.update);
router.delete('/delete/:id', cityControllers.delete);

module.exports = router;
