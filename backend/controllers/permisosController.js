const pool = require('../db'); // assuming you have a db.js for PostgreSQL or MySQL pool

// Crear nuevo permiso
exports.crearPermiso = async (req, res) => {
  try {
    const { motivo, fecha, tipo, empleado_id } = req.body;
    if (!motivo || !fecha || !tipo || !empleado_id) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const result = await pool.query(
      'INSERT INTO permisos (motivo, fecha, tipo, empleado_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [motivo, fecha, tipo, empleado_id]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear permiso' });
  }
};

// Obtener permisos por empleado
exports.obtenerPermisosPorEmpleado = async (req, res) => {
  try {
    const { empleado_id } = req.query;
    if (!empleado_id) return res.status(400).json({ error: 'Se requiere empleado_id' });

    const result = await pool.query(
      'SELECT * FROM permisos WHERE empleado_id = $4 ORDER BY fecha DESC',
      [empleado_id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener permisos' });
  }
};
