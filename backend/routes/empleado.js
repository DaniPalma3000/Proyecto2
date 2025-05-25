const express = require('express');
const router = express.Router();
const {
  registrarEmpleado,
  obtenerEmpleadosPorDepartamento,
  obtenerTodosLosEmpleados
} = require('../controllers/empleadoController');

router.get('/', obtenerTodosLosEmpleados); //all employees

router.post('/', registrarEmpleado);
router.get('/por-departamento/:id', obtenerEmpleadosPorDepartamento);

module.exports = router;
