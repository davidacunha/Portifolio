const express = require('express');
const router = express.Router();

const Add = require('./Add');
const Get = require('./Get');
const Update = require('./Update');
const DeleteRoute = require('./Delete');

router.use('/add', Add);
router.use('/get', Get);
router.use('/update', Update);
router.use('/delete', DeleteRoute);

module.exports = router;
