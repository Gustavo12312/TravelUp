const express = require('express');
const router = express.Router();
const hotelControllers = require('../Controllers/hotelControllers'); 

router.get('/list', hotelControllers.list);
router.post('/create', hotelControllers.create);
router.get('/get/:id', hotelControllers.get);
router.get('/get/city/:cityId', hotelControllers.getCity);
router.put('/update/:id', hotelControllers.update);
router.delete('/delete/:id', hotelControllers.delete);

module.exports = router;
