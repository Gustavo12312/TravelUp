const express = require('express');
const router = express.Router();
const requestControllers = require('../Controllers/requestControllers'); 

router.get('/list', requestControllers.list);
router.post('/create', requestControllers.create);
router.get('/get/:id', requestControllers.get);
router.get('/get/user/:requestedBy', requestControllers.getbyUser);
router.get('/get/status/:requestStatusId', requestControllers.getbyStatusId);
router.get('/get/status/cost/:requestStatusId', requestControllers.getbyStatusIdWithCost);
router.get('/list/approved/:requestedBy', requestControllers.getApprovedrequests);
router.get('/list/open/:requestedBy', requestControllers.getOpenrequests);
router.put('/update/:id', requestControllers.update);
router.delete('/delete/:id', requestControllers.delete);

module.exports = router;
