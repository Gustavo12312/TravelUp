const express = require('express');
const router = express.Router();
const quoteControllers = require('../Controllers/quoteControllers');

router.get('/list', quoteControllers.list);
router.post('/create', quoteControllers.create);
router.get('/getby/:requestId', quoteControllers.getByRequest);
router.get('/get/selected/:requestId', quoteControllers.getSelected);
router.put('/update/:id', quoteControllers.update);
router.delete('/delete/:id', quoteControllers.delete);

module.exports = router;
