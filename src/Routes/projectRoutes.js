const express = require('express');
const router = express.Router();
const projectControllers = require('../Controllers/projectControllers'); 

router.get('/list', projectControllers.list);
router.post('/create', projectControllers.create);
router.get('/get/:id', projectControllers.get);
router.put('/update/:id', projectControllers.update);
router.delete('/delete/:id', projectControllers.delete);

module.exports = router;
