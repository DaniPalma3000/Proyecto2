const pool = require('../db');

const listarEmpleados = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM empleado');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener empleados:', err);
    res.status(500).json({ error: 'Error al obtener empleados desde la base de datos' });
  }
};

const registrarEmpleado = async (req, res) => {
  const { nombre, departamento, rol, descriptor } = req.body;

  if (!nombre || !departamento || !rol || !descriptor) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  if (isNaN(departamento)) {
    return res.status(400).json({ error: 'Departamento inválido' });
  }

  try {
    // Obtener IDs de jornada y departamento (por defecto usamos 1 si no hay lógica avanzada)
    const jornada_id = 1; // aún lo dejamos fijo si no hay lógica extra
    const departamento_id = parseInt(departamento); // 👈 importante si viene como string


    const result = await pool.query(
      `INSERT INTO empleado (nombre, jornada_id, departamento_id, descriptor)
   VALUES ($1, $2, $3, $4)`,
      [nombre, jornada_id, departamento_id, JSON.stringify(descriptor)]
    );

    res.status(200).json({ mensaje: 'Empleado registrado en la base de datos' });
  } catch (err) {
    console.error('Error al registrar empleado:', err);
    if (err.code === '23505') {
      res.status(409).json({ error: 'El código de empleado ya existe' });
    } else {
      res.status(500).json({ error: 'Error al insertar el empleado en la base de datos' });
    }
  }
};

const obtenerDescriptores = async (req, res) => {
  const result = await pool.query('SELECT e_id, nombre, descriptor FROM empleado WHERE descriptor IS NOT NULL');
  res.status(200).json(result.rows);
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

module.exports = { registrarEmpleado, obtenerEmpleadosPorDepartamento, obtenerDescriptores, obtenerTodosLosEmpleados, listarEmpleados };