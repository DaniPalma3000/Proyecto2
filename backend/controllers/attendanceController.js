
const pool = require('../db');
const fs = require('fs');
const path = require('path');

const registrarMarca = async (req, res) => {
  const { e_id } = req.body;
  if (!e_id) {
    return res.status(400).json({ error: 'Código de empleado requerido' });
  }

  try {
    const query = fs.readFileSync(path.join(__dirname, '../queries/attendance.sql'), 'utf8');
    const result = await pool.query(query, [e_id]);

    const tipo = result.rows[0]?.insertar_marca;

    res.status(200).json({
      mensaje: 'Marca registrada correctamente',
      tipo_marca: tipo === 'E' ? 'Entrada' : 'Salida'
    });
  } catch (err) {
    console.error('Error al registrar marca:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { registrarMarca };
