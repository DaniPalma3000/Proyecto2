const express = require('express');
const router = express.Router();
const {
  registrarEmpleado,
  actualizarEmpleado,
  actualizarDescriptorEmpleado,
  eliminarEmpleado,
  listarEmpleados,
  obtenerDescriptores,
  obtenerEmpleadosPorDepartamento,
  obtenerTodosLosEmpleados
} = require('../controllers/empleadoController');

router.post('/empleado', registrarEmpleado);
router.get('/empleado', listarEmpleados);
router.get('/descriptores', obtenerDescriptores);
router.get('/', obtenerTodosLosEmpleados);
router.get('/por-departamento/:id', obtenerEmpleadosPorDepartamento);
router.put('/empleado/:id', actualizarEmpleado);
router.put('/empleado/:id/descriptor', actualizarDescriptorEmpleado);
router.delete('/empleado/:id', eliminarEmpleado);

module.exports = router;
