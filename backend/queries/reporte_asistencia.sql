SELECT
  e.e_id AS codigo_empleado,
  e.nombre AS nombre_empleado,
  d.nombre AS departamento,
  j.nombre AS jornada,
  j.hora_entrada,
  j.hora_salida,
  m.fecha,
  MAX(CASE WHEN m.tipo_marca = 'E' THEN m.hora END) AS hora_entrada_real,
  MAX(CASE WHEN m.tipo_marca = 'S' THEN m.hora END) AS hora_salida_real,
  GREATEST(ROUND(EXTRACT(EPOCH FROM MAX(CASE WHEN m.tipo_marca = 'E' THEN m.hora END) - j.hora_entrada) / 60), 0) AS minutos_tarde,
  GREATEST(ROUND(EXTRACT(EPOCH FROM j.hora_salida - MAX(CASE WHEN m.tipo_marca = 'S' THEN m.hora END)) / 60), 0) AS minutos_temprano,
  p.tipo 
FROM empleado e
JOIN departamento d ON e.departamento_id = d.id
JOIN jornada j ON e.jornada_id = j.id
LEFT JOIN marcas m ON m.empleado_id = e.e_id AND m.fecha BETWEEN $1 AND $2
LEFT JOIN permisos p ON p.empleado_id = e.e_id AND p.fecha = m.fecha
WHERE m.fecha BETWEEN $1 AND $2
  AND ($3::INT IS NULL OR e.e_id = $3)
  AND ($4::INT IS NULL OR j.id = $4)
GROUP BY e.e_id, e.nombre, d.nombre, j.nombre, j.hora_entrada, j.hora_salida, m.fecha, p.tipo
ORDER BY m.fecha, e.e_id;
