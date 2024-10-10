const express = require('express');
const router = express.Router();

const Register = require('./Register');
const Update = require('./Update');

router.use('/Register', Register);
router.use('/Update', Update);

module.exports = router;
