const express = require('express');
const router = express.Router();
const { registrarEmpleado } = require('../controllers/empleadoController');

router.post('/empleado', registrarEmpleado);

module.exports = router;
