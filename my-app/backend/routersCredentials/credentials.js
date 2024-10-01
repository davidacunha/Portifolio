const express = require('express');
const addCredentialRouter = require('./addCredential');
const deleteCredentialRouter = require('./deleteCredential');
const getCredentialRouter = require('./getCredential');
const updateCredential = require('../routersUsers/updateUser');

const router = express.Router();

router.use('/add', addCredentialRouter);
router.use('/update', updateCredentialRouter);
router.use('/delete', deleteCredentialRouter);
router.use('/get', getCredentialRouter);

module.exports = router;
