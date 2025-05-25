const fs = require('fs');
const path = require('path');
const pool = require('../db');

const departamentosEmpleadosQuery = fs.readFileSync(
  path.join(__dirname, '../queries/departamentos.sql'),
  'utf8'
);

const getDepartamentosConEmpleados = async (req, res) => {
  try {
    const { rows } = await pool.query(departamentosEmpleadosQuery);
    
    const departamentosMap = new Map();

    rows.forEach(row => {
      if (!departamentosMap.has(row.departamento_id)) {
        departamentosMap.set(row.departamento_id, {
          id: row.departamento_id,
          nombre: row.departamento_nombre,
          empleados: []
        });
      }
      if (row.empleado_id) {
        departamentosMap.get(row.departamento_id).empleados.push({
          id: row.empleado_id,
          codigo: row.empleado_codigo,
          nombre: row.empleado_nombre,
          jornada: {
            nombre: row.jornada_nombre,
            entrada: row.hora_entrada,
            salida: row.hora_salida,
          }
        });
      }
    });

    const departamentos = Array.from(departamentosMap.values());

    res.json(departamentos);
  } catch (error) {
    console.error('Error fetching departamentos y empleados:', error);
    res.status(500).json({ error: 'Error al obtener departamentos y empleados' });
  }
};

module.exports = { getDepartamentosConEmpleados };