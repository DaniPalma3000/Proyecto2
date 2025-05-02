
const express = require('express');
const router = express.Router();
const { obtenerReporteAsistencia } = require('../controllers/reporteController');

router.get('/reportes/asistencia', obtenerReporteAsistencia);

module.exports = router;
