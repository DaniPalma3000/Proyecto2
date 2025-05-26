const pool = require('../db');
const fs = require('fs');
const path = require('path');

const obtenerReporteAsistencia = async (req, res) => {
  const { inicio, fin, empleado_id, jornada_id } = req.query;

  if (!inicio || !fin) {
    return res.status(400).json({ error: 'Fechas de inicio y fin son requeridas' });
  }

  try {
    const query = fs.readFileSync(path.join(__dirname, '../queries/reporte_asistencia.sql'), 'utf8');
    const result = await pool.query(query, [
      inicio,
      fin,
      empleado_id || null,
      jornada_id || null
    ]);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al generar reporte:', err);
    res.status(500).json({ error: 'Error al generar el reporte' });
  }
};

module.exports = { obtenerReporteAsistencia };
