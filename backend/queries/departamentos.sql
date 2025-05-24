SELECT 
  d.id AS departamento_id,
  d.nombre AS departamento_nombre,
  e.e_id AS empleado_id,
  e.codigo AS empleado_codigo,
  e.nombre AS empleado_nombre,
  j.nombre AS jornada_nombre,
  j.hora_entrada,
  j.hora_salida
FROM departamento d
LEFT JOIN empleado e ON e.departamento_id = d.id
LEFT JOIN jornada j ON e.jornada_id = j.id
ORDER BY d.nombre, e.nombre;
