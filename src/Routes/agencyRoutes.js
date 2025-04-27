const express = require('express');
const router = express.Router();
const agencyControllers = require('../Controllers/agencyControllers'); 

router.get('/list', agencyControllers.list);
router.post('/create', agencyControllers.create);
router.get('/get/:id', agencyControllers.get);
router.put('/update/:id', agencyControllers.update);
router.delete('/delete/:id', agencyControllers.delete);

module.exports = router;
