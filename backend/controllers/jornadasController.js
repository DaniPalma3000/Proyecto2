const pool = require('../db');

const getJornadas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jornada ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    console.error('Error obteniendo jornadas:', err);
    res.status(500).json({ error: 'Error al obtener jornadas' });
  }
};

const crearJornada = async (req, res) => {
  const { nombre, hora_entrada, hora_salida } = req.body;
  if (!nombre || !hora_entrada || !hora_salida) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  try {
    await pool.query(
      'INSERT INTO jornada (nombre, hora_entrada, hora_salida) VALUES ($1, $2, $3)',
      [nombre, hora_entrada, hora_salida]
    );
    res.status(201).json({ mensaje: 'Jornada creada' });
  } catch (err) {
    console.error('Error al crear jornada:', err);
    res.status(500).json({ error: 'Error al crear jornada' });
  }
};

const actualizarJornada = async (req, res) => {
  const { id } = req.params;
  const { nombre, hora_entrada, hora_salida } = req.body;

  try {
    const result = await pool.query(
      'UPDATE jornada SET nombre = $1, hora_entrada = $2, hora_salida = $3 WHERE id = $4',
      [nombre, hora_entrada, hora_salida, id]
    );

    res.status(200).json({ mensaje: 'Jornada actualizada correctamente' });
  } catch (error) {
    console.error('Error actualizando jornada:', error);
    res.status(500).json({ error: 'Error del servidor' });
  }
}

const eliminarJornada = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM jornada WHERE id = $1', [id]);
    res.json({ mensaje: 'Jornada eliminada' });
  } catch (err) {
    console.error('Error al eliminar jornada:', err);
    res.status(500).json({ error: 'Error al eliminar jornada' });
  }
};

module.exports = {
  getJornadas,
  crearJornada,
  actualizarJornada,
  eliminarJornada,
};
