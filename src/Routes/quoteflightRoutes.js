const express = require('express');
const router = express.Router();
const quoteFlightControllers = require('../Controllers/quoteFlightControllers'); 

router.get('/list', quoteFlightControllers.list);
router.post('/create', quoteFlightControllers.create);
router.get('/get/:id', quoteFlightControllers.get);
router.get('/getby/:quoteId', quoteFlightControllers.getFlight);
router.put('/update/:id', quoteFlightControllers.update);
router.delete('/delete/:id', quoteFlightControllers.delete);

module.exports = router;
