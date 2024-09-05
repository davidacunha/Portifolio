const express = require('express');
const addCredentialRouter = require('./addCredential');
const deleteCredentialRouter = require('./deleteCredential');
const getCredentialRouter = require('./getCredential');

const router = express.Router();

router.use('/add', addCredentialRouter);
router.use('/delete', deleteCredentialRouter);
router.use('/get', getCredentialRouter);

module.exports = router;
