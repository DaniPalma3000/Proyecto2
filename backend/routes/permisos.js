const express = require('express');
const router = express.Router();
const {
  crearPermiso,
  obtenerPermisosPorEmpleado,
} = require('../controllers/permisosController');

// POST /api/permisos
router.post('/', crearPermiso);

// GET /api/permisos?empleado_id
router.get('/', obtenerPermisosPorEmpleado);

module.exports = router;
