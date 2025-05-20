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

module.exports = router;
