const express = require('express');
const router = express.Router();
const airportControllers = require('../Controllers/airportControllers');

router.get('/list', airportControllers.list);
router.post('/create', airportControllers.create);
router.get('/get/:id', airportControllers.get);
router.get('/get/city/:cityId', airportControllers.getCity);
router.put('/update/:id', airportControllers.update);
router.delete('/delete/:id', airportControllers.delete);

module.exports = router;
