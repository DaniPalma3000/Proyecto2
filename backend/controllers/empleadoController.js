const pool = require('../db');

const listarEmpleados = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.e_id,
        e.nombre,
        e.departamento_id,
        d.nombre AS departamento_nombre,
        e.jornada_id,
        j.nombre AS jornada_nombre
      FROM empleado e
      JOIN departamento d ON e.departamento_id = d.id
      JOIN jornada j ON e.jornada_id = j.id
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error al obtener empleados:', err);
    res.status(500).json({ error: 'Error al obtener empleados desde la base de datos' });
  }
};

const registrarEmpleado = async (req, res) => {
  const { nombre, departamento, jornada_id, descriptor } = req.body;

  if (!nombre || !departamento || !jornada_id || !descriptor) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    await pool.query(
      'INSERT INTO empleado (nombre, jornada_id, departamento_id, descriptor) VALUES ($1, $2, $3, $4)',
      [nombre, jornada_id, departamento, JSON.stringify(descriptor)]
    );
    res.status(200).json({ mensaje: 'Empleado registrado correctamente' });
  } catch (err) {
    console.error('Error al registrar empleado:', err);
    res.status(500).json({ error: 'Error al insertar el empleado' });
  }
};

const actualizarEmpleado = async (req, res) => {
  const { id } = req.params;
  const { nombre, departamento_id, jornada_id } = req.body;

  try {
    await pool.query(
      'UPDATE empleado SET nombre = $1, departamento_id = $2, jornada_id = $3 WHERE e_id = $4',
      [nombre, departamento_id, jornada_id, id]
    );
    res.status(200).json({ mensaje: 'Empleado actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar empleado:', err);
    res.status(500).json({ error: 'Error al actualizar empleado' });
  }
};

const actualizarDescriptorEmpleado = async (req, res) => {
  const { id } = req.params;
  const { descriptor } = req.body;

  if (!descriptor || !Array.isArray(descriptor) || descriptor.length !== 128) {
    return res.status(400).json({ error: 'Descriptor inválido' });
  }

  try {
    await pool.query('UPDATE empleado SET descriptor = $1 WHERE e_id = $2', [JSON.stringify(descriptor), id]);
    res.status(200).json({ mensaje: 'Descriptor actualizado correctamente' });
  } catch (err) {
    console.error('Error al actualizar descriptor:', err);
    res.status(500).json({ error: 'Error en el servidor al actualizar descriptor' });
  }
};

const eliminarEmpleado = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('BEGIN');

    await pool.query('DELETE FROM marcas WHERE empleado_id = $1', [id]);

    await pool.query('DELETE FROM empleado WHERE e_id = $1', [id]);

    await pool.query('COMMIT');
    res.status(200).json({ mensaje: 'Empleado y marcas eliminadas correctamente' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Error eliminando empleado:', err);
    res.status(500).json({ error: 'Error al eliminar empleado' });
  }
};


const obtenerDescriptores = async (req, res) => {
  const result = await pool.query('SELECT e_id, nombre, descriptor FROM empleado WHERE descriptor IS NOT NULL');
  res.status(200).json(result.rows);
};

const obtenerEmpleadosPorDepartamento = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM empleado WHERE departamento_id = $1', [id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo empleados:', err);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
};

const obtenerTodosLosEmpleados = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM empleado');
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener todos los empleados:', err);
    res.status(500).json({ error: 'Error al obtener empleados' });
  }
};

module.exports = {
  registrarEmpleado,
  actualizarEmpleado,
  actualizarDescriptorEmpleado,
  eliminarEmpleado,
  listarEmpleados,
  obtenerDescriptores,
  obtenerEmpleadosPorDepartamento,
  obtenerTodosLosEmpleados
};
