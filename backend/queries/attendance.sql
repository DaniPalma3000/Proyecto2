
INSERT INTO marcas (empleado_id, tipo_marca, fecha)
VALUES ((SELECT e_id FROM empleado WHERE codigo = $1), $2, $3)
