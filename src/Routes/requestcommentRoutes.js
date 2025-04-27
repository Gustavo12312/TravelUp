const express = require('express');
const router = express.Router();
const requestCommentControllers = require('../Controllers/requestCommentControllers');

router.get('/list', requestCommentControllers.list);
router.post('/create', requestCommentControllers.create);
router.get('/get/:requestId', requestCommentControllers.get);
router.put('/update/:id', requestCommentControllers.update);
router.delete('/delete/:id', requestCommentControllers.delete);

module.exports = router;
