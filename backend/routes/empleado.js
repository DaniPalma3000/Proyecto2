const express = require('express');
const { registrarEmpleado, obtenerDescriptores, listarEmpleados } = require('../controllers/empleadoController');
const router = express.Router();

router.post('/empleado', registrarEmpleado);
router.get('/empleado', listarEmpleados);
router.get('/descriptores', obtenerDescriptores);

module.exports = router;
