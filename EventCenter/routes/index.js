/** Routes to the /api directory where all routes for the form and user exists */

const express = require('express');
const router = express.Router();

router.use('/api', require('./api'));
module.exports = router;