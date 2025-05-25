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

const obtenerEmpleadosPorDepartamento = async (req, res) => {
  const { id } = req.params;
  console.log('Department ID received:', id);

  try {
    const result = await pool.query(
      'SELECT * FROM empleado WHERE departamento_id = $1',
      [id]
    );
    console.log('Query result:', result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error obteniendo empleados:', error);
    res.status(500).json({ error: 'Error retrieving employees' });
  }
};

const obtenerTodosLosEmpleados = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM empleado');
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener todos los empleados:', error);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
};

module.exports = { registrarEmpleado, obtenerEmpleadosPorDepartamento, obtenerTodosLosEmpleados };