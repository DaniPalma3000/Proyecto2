
const pool = require('../db');
const fs = require('fs');
const path = require('path');

const verificarCredenciales = async (req, res) => {
  const { usuario, contrasena } = req.body;
  if (!usuario || !contrasena) {
    return res.status(400).json({ error: 'Faltan usuario o contraseña' });
  }

  try {
    const query = fs.readFileSync(path.join(__dirname, '../queries/login.sql'), 'utf8');
    const result = await pool.query(query, [usuario, contrasena]);

    if (result.rows.length > 0) {
      res.status(200).json({ mensaje: 'Acceso concedido', usuario: result.rows[0] });
    } else {
      res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  } catch (err) {
    console.error('Error al verificar login:', err);
    res.status(500).json({ error: 'Error del servidor' });
  }
};

module.exports = { verificarCredenciales };
