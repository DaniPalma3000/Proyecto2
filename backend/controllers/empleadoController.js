const pool = require('../db');

const registrarEmpleado = async (req, res) => {
  const { codigo, nombre } = req.body;

  if (!codigo || !nombre) {
    return res.status(400).json({ error: 'Código y nombre son obligatorios' });
  }

  try {
    await pool.query(
      'INSERT INTO empleado (codigo, nombre, jornada_id, departamento_id) VALUES ($1, $2, 1, 1)',
      [codigo, nombre]
    );
    res.status(200).json({ mensaje: 'Empleado registrado en la base de datos' });
  } catch (err) {
    console.error('Error al registrar empleado:', err);
    res.status(500).json({ error: 'Error al insertar el empleado en la base de datos' });
  }
};

module.exports = { registrarEmpleado };
