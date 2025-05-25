const pool = require('../db');

const registrarUsuario = async (req, res) => {
  const { usuario, contrasena, rol } = req.body;

  if (!usuario || !contrasena || !rol) {
    return res.status(400).json({ error: 'Usuario, contraseña y rol son obligatorios' });
  }

  try {
    const existe = await pool.query('SELECT 1 FROM usuarios WHERE usuario = $1', [usuario]);
    if (existe.rowCount > 0) {
      return res.status(400).json({ error: 'Usuario ya existe' });
    }

    await pool.query(
      'INSERT INTO usuarios (usuario, contrasena, rol) VALUES ($1, $2, $3)',
      [usuario, contrasena, rol]
    );

    res.status(201).json({ mensaje: 'Usuario registrado' });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
};

module.exports = { registrarUsuario };
