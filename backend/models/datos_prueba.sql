
-- Departamentos y Jornadas
INSERT INTO departamento (nombre) VALUES ('Contabilidad'), ('RRHH'), ('Desarrollo');
INSERT INTO jornada (nombre, hora_entrada, hora_salida) VALUES
('Diurna', '08:00', '17:00'),
('Matutina', '07:00', '14:00'),
('Vespertina', '14:00', '20:00');

-- Empleados
INSERT INTO empleado (codigo, nombre, jornada_id, departamento_id) VALUES
('E001', 'Juan Pérez', 1, 1),
('E002', 'Ana Gómez', 2, 2),
('E003', 'Carlos Díaz', 3, 3);

-- Usuario admin
INSERT INTO usuarios (usuario, contrasena, rol) VALUES
('admin', '1234', 'admin');

-- Marcas
INSERT INTO marcas (empleado_id, tipo_marca, fecha, hora) VALUES
(1, 'entrada', '2025-05-01', '08:03'),
(1, 'salida', '2025-05-01', '17:01'),
(2, 'entrada', '2025-05-01', '07:12'),
(2, 'salida', '2025-05-01', '14:00');

-- Permisos
INSERT INTO permisos (empleado_id, fecha, motivo, tipo) VALUES
(3, '2025-05-01', 'Consulta médica', 'ausencia');
