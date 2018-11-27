/** Routes to the form and user routes */
const express = require('express');
const router = express.Router();

router.use('/form', require('./form'));
router.use('/user', require('./user'));

module.exports = router;