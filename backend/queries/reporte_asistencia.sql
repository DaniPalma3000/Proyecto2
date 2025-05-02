
SELECT
  e.codigo AS codigo_empleado,
  e.nombre AS nombre_empleado,
  d.nombre AS departamento,
  j.nombre AS jornada,
  j.hora_entrada,
  j.hora_salida,
  m.fecha,
  MAX(CASE WHEN m.tipo_marca = 'entrada' THEN m.hora END) AS hora_entrada,
  MAX(CASE WHEN m.tipo_marca = 'salida' THEN m.hora END) AS hora_salida,
  GREATEST(EXTRACT(MINUTE FROM MAX(CASE WHEN m.tipo_marca = 'entrada' THEN m.hora END) - j.hora_entrada), 0) AS minutos_tarde,
  GREATEST(EXTRACT(MINUTE FROM j.hora_salida - MAX(CASE WHEN m.tipo_marca = 'salida' THEN m.hora END)), 0) AS minutos_temprano
FROM empleado e
JOIN departamento d ON e.departamento_id = d.id
JOIN jornada j ON e.jornada_id = j.id
LEFT JOIN marcas m ON m.empleado_id = e.e_id
WHERE m.fecha BETWEEN $1 AND $2
GROUP BY e.codigo, e.nombre, d.nombre, j.nombre, j.hora_entrada, j.hora_salida, m.fecha
ORDER BY m.fecha, e.codigo;
