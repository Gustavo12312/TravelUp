const express = require('express');
const router = express.Router();
const personalDetailControllers = require('../Controllers/personaldetailControllers'); 
const multer = require('../multer')

router.get('/list', personalDetailControllers.list);
router.post('/create', multer, personalDetailControllers.create);
router.get('/get/:userId', personalDetailControllers.get);
router.put('/update/:id', multer, personalDetailControllers.update);
router.delete('/delete/:id', personalDetailControllers.delete);

module.exports = router;
