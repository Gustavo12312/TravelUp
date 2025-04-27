const express = require('express');
const router = express.Router();
const quoteHotelControllers = require('../Controllers/quoteHotelControllers'); 

router.get('/list', quoteHotelControllers.list);
router.post('/create', quoteHotelControllers.create);
router.get('/get/:id', quoteHotelControllers.get);
router.get('/getby/:quoteId', quoteHotelControllers.getByHotel);
router.put('/update/:id', quoteHotelControllers.update);
router.delete('/delete/:id', quoteHotelControllers.delete);

module.exports = router;
