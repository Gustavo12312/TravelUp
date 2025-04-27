const express = require('express');
const router = express.Router();
const protocolControllers = require('../Controllers/protocolControllers');

router.get('/list', protocolControllers.list);
router.post('/create', protocolControllers.create);
router.get('/get/:hotelId', protocolControllers.get);
router.put('/update/:hotelId', protocolControllers.update);
router.delete('/delete/:id', protocolControllers.delete);

module.exports = router;
