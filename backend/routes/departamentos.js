const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/departamentos', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre FROM departamento ORDER BY id');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching departamentos:', error);
    res.status(500).json({ error: 'Error fetching departamentos' });
  }
});

// POST /api/departamentos
router.post('/departamentos', async (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ error: 'Nombre es requerido' });

  try {
    const result = await pool.query('INSERT INTO departamento (nombre) VALUES ($1) RETURNING *', [nombre]);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error agregando departamento:', error);
    res.status(500).json({ error: 'Error inserting departamento' });
  }
});

// DELETE /api/departamentos/:id
router.delete('/departamentos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM departamento WHERE id = $1', [id]);
    res.status(204).send(); // success, no content
  } catch (error) {
    console.error('Error eliminando departamento:', error);
    res.status(500).json({ error: 'Error eliminando departamento' });
  }
});

// GET /api/departamentos/:id/empleados
router.get('/departamentos/:id/empleados', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT e.e_id, e.nombre, e.codigo
       FROM empleado e
       JOIN departamento d ON e.departamento_id = d.id
       WHERE d.id = $1`,
      [id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching empleados del departamento:', error);
    res.status(500).json({ error: 'Error al obtener empleados del departamento' });
  }
});


module.exports = router;
