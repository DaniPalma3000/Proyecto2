
const express = require('express');
const router = express.Router();
const { registrarMarca } = require('../controllers/attendanceController');

router.post('/marcar', registrarMarca);

module.exports = router;
