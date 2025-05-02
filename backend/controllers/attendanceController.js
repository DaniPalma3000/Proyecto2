
const pool = require('../db');
const fs = require('fs');
const path = require('path');

const registrarMarca = async (req, res) => {
  const { codigo_empleado, tipo_marca, fecha } = req.body;

  if (!codigo_empleado || !tipo_marca || !fecha) {
    return res.status(400).json({ error: 'Faltan datos obligatorios' });
  }

  try {
    const query = fs.readFileSync(path.join(__dirname, '../queries/attendance.sql'), 'utf8');
    const result = await pool.query(query, [codigo_empleado, tipo_marca, fecha]);
    res.status(200).json({ mensaje: 'Marca registrada correctamente', resultado: result.rowCount });
  } catch (err) {
    console.error('Error al registrar marca:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { registrarMarca };
