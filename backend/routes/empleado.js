const express = require('express');
const { registrarEmpleado, obtenerDescriptores, listarEmpleados, obtenerTodosLosEmpleados, obtenerEmpleadosPorDepartamento } = require('../controllers/empleadoController');
const router = express.Router();

router.post('/empleado', registrarEmpleado);
router.get('/empleado', listarEmpleados);
router.get('/descriptores', obtenerDescriptores);
router.get('/', obtenerTodosLosEmpleados); //all employees
router.get('/por-departamento/:id', obtenerEmpleadosPorDepartamento);

module.exports = router;
